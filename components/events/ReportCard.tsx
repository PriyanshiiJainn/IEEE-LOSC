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
    <article className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {report.coverImageUrl && (
        <img
          src={report.coverImageUrl}
          alt=""
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-5">
        <h3 className="font-semibold text-ieee-navy">{report.title}</h3>
        {dateStr && <p className="text-sm text-gray-500 mt-1">{dateStr}</p>}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{report.content}</p>
      </div>
    </article>
  );
}
