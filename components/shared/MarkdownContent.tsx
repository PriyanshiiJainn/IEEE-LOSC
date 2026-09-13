import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  preserveIndentation,
  remarkHtmlAsText,
  remarkNoIndentedCode,
} from "@/lib/markdown";

type Props = {
  children?: string | null;
  className?: string;
};

/**
 * Text an admin typed, shown on the public site as close to verbatim as
 * markdown allows.
 *
 * The rule is: nothing an admin types may silently vanish or rearrange itself.
 * That takes four things working together.
 *
 * 1. `white-space: pre-wrap` on every text element (see TEXT below). Runs of
 *    spaces and single newlines are in the markup already — only CSS was
 *    collapsing them. This is also why remark-breaks is gone: it turns a
 *    newline into <br> *and* leaves the newline behind, which under pre-wrap
 *    reads as two line breaks.
 * 2. `preserveIndentation` keeps hand-aligned indentation, which markdown
 *    otherwise strips off the front of a line.
 * 3. `remarkNoIndentedCode` stops an indented line becoming a grey code block.
 * 4. `remarkHtmlAsText` shows "<100 people" instead of eating it as a tag.
 *
 * Tailwind's preflight strips default heading/list/quote styling, so every
 * element the editor can produce is mapped explicitly below — otherwise
 * "# Heading" renders at body size and looks like the "#" was simply eaten.
 *
 * Long content is never clipped: blocks wrap (`break-words`) and grow the page
 * rather than the page growing sideways. Only code and tables, which cannot
 * reflow, scroll within themselves.
 */

/** Preserve the author's spacing, and wrap rather than overflow. */
const TEXT = "whitespace-pre-wrap break-words";

export function MarkdownContent({ children, className = "" }: Props) {
  const text = children ?? "";
  if (!text.trim()) return null;

  return (
    <div className={className}>
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkNoIndentedCode, remarkGfm, remarkHtmlAsText]}
        components={{
          p: ({ children }) => <p className={`mb-4 last:mb-0 leading-relaxed ${TEXT}`}>{children}</p>,

          h1: ({ children }) => (
            <h2 className={`text-2xl font-semibold text-ieee-navy mt-6 mb-3 first:mt-0 ${TEXT}`}>{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className={`text-xl font-semibold text-ieee-navy mt-6 mb-3 first:mt-0 ${TEXT}`}>{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className={`text-lg font-semibold text-ieee-navy mt-5 mb-2 first:mt-0 ${TEXT}`}>{children}</h4>
          ),
          h4: ({ children }) => (
            <h5 className={`text-base font-semibold text-ieee-navy mt-4 mb-2 first:mt-0 ${TEXT}`}>{children}</h5>
          ),
          h5: ({ children }) => (
            <h6 className={`text-sm font-semibold text-ieee-navy mt-4 mb-2 first:mt-0 ${TEXT}`}>{children}</h6>
          ),
          h6: ({ children }) => (
            <h6 className={`text-sm font-semibold text-ieee-gray mt-4 mb-2 first:mt-0 ${TEXT}`}>{children}</h6>
          ),

          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <del className="line-through">{children}</del>,

          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 last:mb-0 space-y-1.5 marker:text-ieee-red">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 last:mb-0 space-y-1.5 marker:text-ieee-red">{children}</ol>
          ),
          li: ({ children }) => <li className={`leading-relaxed ${TEXT}`}>{children}</li>,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ieee-red underline underline-offset-2 hover:text-ieee-red/80 break-words"
            >
              {children}
            </a>
          ),

          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 border-ieee-red/40 pl-4 italic text-gray-700 my-4 ${TEXT}`}>
              {children}
            </blockquote>
          ),

          hr: () => <hr className="my-6 border-gray-200" />,

          code: ({ className: codeClass, children }) => {
            // Fenced blocks arrive with a language class; inline code has none.
            const isBlock = Boolean(codeClass);
            if (isBlock) {
              return <code className="block font-mono text-sm">{children}</code>;
            }
            return (
              <code className={`rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-ieee-navy ${TEXT}`}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-4 last:mb-0 overflow-x-auto rounded bg-gray-100 p-3 text-sm">{children}</pre>
          ),

          // GFM tables: scroll sideways rather than forcing the page wide.
          table: ({ children }) => (
            <div className="mb-4 last:mb-0 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          th: ({ children }) => (
            <th className={`border border-gray-200 px-3 py-2 text-left font-semibold text-ieee-navy ${TEXT}`}>
              {children}
            </th>
          ),
          td: ({ children }) => <td className={`border border-gray-200 px-3 py-2 align-top ${TEXT}`}>{children}</td>,

          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="my-4 max-w-full rounded" />
          ),
        }}
      >
        {preserveIndentation(text)}
      </ReactMarkdown>
    </div>
  );
}
