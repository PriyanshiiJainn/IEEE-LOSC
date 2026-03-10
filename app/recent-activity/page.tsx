import { getRecentActivities } from "@/lib/data";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

export default async function RecentActivityPage() {
  const activities = await getRecentActivities();

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-6">
        Recent Activities
      </h1>

      <p className="max-w-3xl mx-auto text-gray-800 mb-12 leading-relaxed text-center">
        The <span className="text-ieee-red">LNMIIT Optica Student Chapter (LOSC)</span> will be
        inaugurated on <span className="text-ieee-red">12 March 2026</span> in the presence of
        distinguished dignitaries and esteemed guests. The event will be graced by{" "}
        <span className="text-ieee-red">Prof. Muhammad Agus Hatta</span>, Vice Rector for Research,
        Innovation, Cooperation, and Alumni at Institut Teknologi Sepuluh Nopember (ITS), Indonesia,
        and <span className="text-ieee-red">Dr. Rikmantra Basu</span>, Associate Professor and Head
        of the Department of Electronics and Communication Engineering, NIT Delhi.
      </p>

      {activities.length > 0 && (
        <div className="space-y-10 max-w-4xl mx-auto">
          {activities.map((activity) => {
            const dateStr = activity.publishedAt
              ? new Date(activity.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : null;

            return (
              <article key={activity.id}>
                <h3 className="text-xl font-semibold text-ieee-navy">{activity.title}</h3>
                {dateStr && <p className="text-sm text-gray-500 mt-1">{dateStr}</p>}

                <div className="text-gray-800 mt-3 leading-relaxed">
                  <MarkdownContent>{activity.content}</MarkdownContent>
                </div>

                {activity.pdfUrl && (
                  <div className="mt-5">
                    <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <iframe
                        src={activity.pdfUrl}
                        title={`${activity.title} PDF`}
                        className="w-full h-[600px] border-0"
                      />
                    </div>
                    <div className="flex gap-3 mt-3">
                      <a
                        href={activity.pdfUrl}
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
                        href={activity.pdfUrl}
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

                <hr className="mt-8 border-gray-200" />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
