import type { EventReportItem } from "@/lib/data";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

export function ReportCard({ report }: { report: EventReportItem }) {
  const dateStr = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {report.coverImageUrl && (
        <img
          src={report.coverImageUrl}
          alt=""
          className="w-full h-44 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-ieee-navy">{report.title}</h3>
        {dateStr && <p className="text-sm text-gray-500 mt-1">{dateStr}</p>}

        <div className="text-gray-800 mt-4 leading-relaxed">
          <MarkdownContent>{report.content}</MarkdownContent>
        </div>

        {report.pdfUrl && (
          <div className="mt-5">
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <iframe
                src={report.pdfUrl}
                title={`${report.title} PDF`}
                className="w-full h-[600px] border-0"
              />
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded bg-ieee-navy px-4 py-2 text-sm font-medium text-white hover:bg-ieee-navy/90 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in new tab
              </a>
              <a
                href={report.pdfUrl}
                download
                className="inline-flex items-center gap-1.5 rounded border border-ieee-red px-4 py-2 text-sm font-medium text-ieee-red hover:bg-ieee-red/5 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
