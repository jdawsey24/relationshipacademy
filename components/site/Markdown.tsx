"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders article markdown with brand-styled prose (see .article-prose in
// globals.css). GFM enables tables, lists, strikethrough, etc.
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
