import { inflateRawSync } from "node:zlib";

// Minimal, namespace-tolerant .xlsx reader.
//
// Why hand-rolled: this machine has no openpyxl and the repo has no spreadsheet
// dependency. The RLC workbooks also vary in XML shape — some are written by
// Excel (`<sheet …>`), some by a generator that namespaces every element
// (`<x:sheet …>`) and orders attributes differently — so every pattern here is
// prefix-tolerant. Verified against all four RLC workbooks.
//
// Read-only and structural: enough to pull header rows and cell values out of a
// sheet. No formulas, no styles, no dates-as-serials handling (the RLC workbooks
// carry dates as text).
//
// Zero dependencies: an .xlsx is a ZIP of XML, and Node can inflate it natively,
// so the central directory is walked here rather than pulling in a zip library
// for a script that runs a handful of times.

export interface Sheet {
  name: string;
  /** All non-empty rows, each as an array of column values in column order. */
  rows(): string[][];
  /**
   * Find the header row and return the table beneath it. The RLC workbooks put
   * a title and a usage note above the header, and the header is not always on
   * the same row — so it is DETECTED, not hardcoded.
   * @param mustContain lowercase substrings that identify the header row
   */
  detectTable(mustContain: string[]): { headerRow: number; headers: string[]; data: string[][] };
}

export interface Workbook {
  sheetNames: string[];
  sheet(name: string): Sheet | undefined;
}

const rx = {
  sheetTag: /<(?:\w+:)?sheet\b[^>]*\/?>/g,
  name: /name="([^"]+)"/,
  rid: /r:id="([^"]+)"/,
  rel: /Id="([^"]+)"[^>]*Target="([^"]+)"/g,
  si: /<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g,
  row: /<(?:\w+:)?row\b([^>]*)>([\s\S]*?)<\/(?:\w+:)?row>/g,
  cell: /<(?:\w+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g,
  ref: /r="([A-Z]+)\d+"/,
  type: /t="(\w+)"/,
  value: /<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/,
  tags: /<[^>]*>/g,
};

/** Excel column letters → 0-based index ("A"→0, "AB"→27). */
function colIndex(letters: string): number {
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
   .replace(/&quot;/g, '"').replace(/&apos;/g, "'");

/** Walk a ZIP's central directory and inflate every member. */
function unzip(input: Buffer): Map<string, Buffer> {
  const buf = Buffer.from(input);
  // End of Central Directory: scan back for signature 0x06054b50.
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66_000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("not a zip file (no end-of-central-directory record)");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);

  const out = new Map<string, Buffer>();
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;          // central file header
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);

    // Local header: sizes there can be zeroed, so use the central directory's.
    const lNameLen = buf.readUInt16LE(localOff + 26);
    const lExtraLen = buf.readUInt16LE(localOff + 28);
    const start = localOff + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(start, start + compSize);
    try {
      out.set(name, method === 0 ? Buffer.from(raw) : inflateRawSync(raw));
    } catch {
      // A member we cannot inflate is skipped rather than failing the workbook.
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return out;
}

export function readWorkbook(input: Buffer | Uint8Array): Workbook {
  const files = unzip(Buffer.from(input));
  const read = (p: string) => files.get(p)?.toString("utf8") ?? "";

  // Shared strings
  const ssXml = read("xl/sharedStrings.xml");
  const shared: string[] = [];
  for (const m of ssXml.matchAll(rx.si)) shared.push(decode(m[1].replace(rx.tags, "")).trim());

  // Sheet name → part path (via rels when present, else positional)
  const wbXml = read("xl/workbook.xml");
  const relsXml = read("xl/_rels/workbook.xml.rels");
  const relMap = new Map<string, string>();
  for (const m of relsXml.matchAll(rx.rel)) relMap.set(m[1], m[2]);
  const positional = [...files.keys()]
    .filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
    .sort((a, b) => Number(a.match(/(\d+)/)![1]) - Number(b.match(/(\d+)/)![1]));

  const entries: { name: string; path: string }[] = [];
  let i = 0;
  for (const tag of wbXml.match(rx.sheetTag) ?? []) {
    const name = tag.match(rx.name)?.[1];
    const rid = tag.match(rx.rid)?.[1];
    let path = rid ? relMap.get(rid) : undefined;
    if (path) path = path.startsWith("xl/") ? path : "xl/" + path.replace(/^\//, "");
    if (!path || !files.has(path)) path = positional[i];
    if (name && path) entries.push({ name, path });
    i++;
  }

  function makeSheet(name: string, path: string): Sheet {
    const xml = read(path);
    let cached: string[][] | null = null;

    const rows = (): string[][] => {
      if (cached) return cached;
      const out: string[][] = [];
      for (const rm of xml.matchAll(rx.row)) {
        const cells: string[] = [];
        let auto = 0;
        for (const cm of rm[2].matchAll(rx.cell)) {
          const attrs = cm[1] ?? "";
          const body = cm[2] ?? "";
          const ref = attrs.match(rx.ref);
          const idx = ref ? colIndex(ref[1]) : auto;
          auto = idx + 1;
          const t = attrs.match(rx.type)?.[1];
          let val = "";
          if (t === "inlineStr") {
            val = decode(body.replace(rx.tags, "")).trim();
          } else {
            const v = body.match(rx.value);
            if (v) {
              const raw = v[1];
              val = t === "s" && /^\d+$/.test(raw) && Number(raw) < shared.length
                ? shared[Number(raw)]
                : decode(raw).trim();
            }
          }
          while (cells.length < idx) cells.push("");
          cells[idx] = val;
        }
        if (cells.some((c) => c !== "")) out.push(cells);
      }
      cached = out;
      return out;
    };

    const detectTable = (mustContain: string[]) => {
      const all = rows();
      for (let r = 0; r < Math.min(all.length, 15); r++) {
        const joined = all[r].join(" | ").toLowerCase();
        if (mustContain.every((m) => joined.includes(m))) {
          return { headerRow: r + 1, headers: all[r], data: all.slice(r + 1) };
        }
      }
      // No header matched — return everything so the caller can report, not crash.
      return { headerRow: 0, headers: [], data: all };
    };

    return { name, rows, detectTable };
  }

  const built = new Map(entries.map((e) => [e.name, makeSheet(e.name, e.path)]));
  return { sheetNames: entries.map((e) => e.name), sheet: (n) => built.get(n) };
}
