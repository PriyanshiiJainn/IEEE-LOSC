import { getEventReports } from "@/lib/data";
import { ReportCard } from "@/components/events/ReportCard";

export const dynamic = "force-dynamic";

export default async function EventReportsPage() {
  const reports = await getEventReports();
  const momReports = reports.filter((report) => Boolean(report.pdfUrl));
  const eventReports = reports.filter((report) => !report.pdfUrl);
  const hasAnyReports = momReports.length > 0 || eventReports.length > 0;

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-4">
        MOM & Event Reports
      </h1>
      <p className="max-w-4xl mx-auto text-red-500 mb-6 text-center">
        Minutes of Meeting and reports of the events
      </p>

      {!hasAnyReports ? (
        <p className="text-gray-700">No reports yet.</p>
      ) : (
        <div className="space-y-12">
          {eventReports.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-ieee-navy">Event Reports</h2>
              <div className="space-y-8">
                {eventReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          )}

          {momReports.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-ieee-navy">MOM</h2>
              <div className="space-y-8">
                {momReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
