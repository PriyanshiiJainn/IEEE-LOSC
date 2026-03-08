import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
  className?: string;
};

export function MarkdownContent({ children, className = "" }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown
        skipHtml
        
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
