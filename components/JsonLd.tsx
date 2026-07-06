// Renders a JSON-LD structured-data block. type="application/ld+json" is a data
// block (not executed), so it's safe under the CSP. `<` is escaped to avoid any
// chance of breaking out of the script element.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
