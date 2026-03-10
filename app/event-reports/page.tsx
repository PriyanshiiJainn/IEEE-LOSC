import { getEventReports } from "@/lib/data";
import { ReportCard } from "@/components/events/ReportCard";

export default async function EventReportsPage() {
  const reports = await getEventReports();

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-4">
        MOM
      </h1>
      <p className="max-w-4xl mx-auto text-red-500 mb-6 text-center">
        Minutes of Meeting
      </p>

      {reports.length === 0 ? (
        <p className="text-gray-700">No reports yet.</p>
      ) : (
        <div className="space-y-8">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}
