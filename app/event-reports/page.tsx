import { getEventReports } from "@/lib/data";
import { ReportCard } from "@/components/events/ReportCard";

export default async function EventReportsPage() {
  const reports = await getEventReports();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-[5vw] font-heading text-ieee-navy text-center mb-2">Event Reports</h1>
      <p className="text-gray-800 mb-8">
        Summaries and highlights from past events.
      </p>

      {reports.length === 0 ? (
        <p className="text-gray-700">No reports yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}
