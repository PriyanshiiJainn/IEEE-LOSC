import type { EventReportItem } from "@/lib/data";

export function ReportCard({ report }: { report: EventReportItem }) {
  const dateStr = report.publishedAt
    ? new Date(report.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      {report.coverImageUrl && (
        <img
          src={report.coverImageUrl}
          alt=""
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-ieee-navy">{report.title}</h3>
        {dateStr && <p className="text-sm text-gray-500 mt-1">{dateStr}</p>}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{report.content}</p>

        {report.pdfUrl && (
          <div className="mt-auto pt-4 flex gap-3">
            <a
              href={report.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded bg-ieee-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-ieee-navy/90 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View PDF
            </a>
            <a
              href={report.pdfUrl}
              download
              className="inline-flex items-center gap-1.5 rounded border border-ieee-red px-3 py-1.5 text-sm font-medium text-ieee-red hover:bg-ieee-red/5 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
