#!/usr/bin/env python3
"""Right-size and rebuild the Relationship Snapshot question sets from the item
bank, deterministically. Each quiz's length scales to its cluster count; every
question draws distinct clusters (one statement each), cluster appearances are
balanced, and statement reuse is minimized (least-used-first).

  python3 scripts/buildSnapshotQuestions.py   # rewrites data/quiz_questions.json
"""
import json, collections, os

DATA = os.path.join(os.path.dirname(__file__), "..", "data")
LENGTH = {4: 10, 6: 14, 12: 22}   # questions per quiz, by valid-cluster count


def load(f):
    return json.load(open(os.path.join(DATA, f)))


def option_counts(n_clusters, q):
    if n_clusters <= 4:
        return [n_clusters] * q            # one option per cluster
    return [5 if i % 2 == 0 else 4 for i in range(q)]   # alternate 5/4


def build_assessment(clusters, bank, q, k_list):
    total_slots = sum(k_list)
    # balanced cluster-appearance targets
    base, rem = divmod(total_slots, len(clusters))
    remaining = {c: base + (1 if i < rem else 0) for i, c in enumerate(clusters)}
    # per-cluster statement usage (least-used-first selection)
    use = {c: collections.Counter({s: 0 for s in bank[c]}) for c in clusters}

    def pick_statement(c):
        # lowest use count, then stable by bank order
        best = min(bank[c], key=lambda s: (use[c][s], bank[c].index(s)))
        use[c][best] += 1
        return best

    questions = []
    for qi, k in enumerate(k_list):
        # choose k distinct clusters with the most appearances left (stable tiebreak)
        ranked = sorted(clusters, key=lambda c: (-remaining[c], c))
        chosen = ranked[:k]
        opts = []
        for c in chosen:
            remaining[c] = max(0, remaining[c] - 1)
            opts.append({"cluster_id": c, "statement": pick_statement(c)})
        questions.append({"question_order": qi + 1, "option_count": len(opts), "options": opts})
    return questions


def main():
    items = load("quiz_items.json")
    assessments = load("assessments.json")
    bank = collections.defaultdict(list)
    for it in items:
        bank[it["cluster_id"]].append(it["statement"])

    out = {}
    for a in assessments:
        clusters = sorted(a["valid_clusters"])
        n = len(clusters)
        q = LENGTH.get(n, 22)
        k_list = option_counts(n, q)
        out[a["id"]] = build_assessment(clusters, {c: bank[c] for c in clusters}, q, k_list)

    with open(os.path.join(DATA, "quiz_questions.json"), "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)

    # report
    for aid, qs in out.items():
        slots = sum(len(x["options"]) for x in qs)
        counts = collections.Counter(o["statement"] for x in qs for o in x["options"])
        maxreuse = max(counts.values())
        print(f"{aid:<12} {len(qs):>2} questions  {slots:>3} slots  {len(counts):>3} distinct  reuse {slots/len(counts):.2f}x  max {maxreuse}x")


if __name__ == "__main__":
    main()
