import { getRecentActivities, getRecentActivityIntro } from "@/lib/data";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

export const dynamic = "force-dynamic";

export default async function RecentActivityPage() {
  const intro = await getRecentActivityIntro();
  const activities = await getRecentActivities();

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-6">
        Recent Activities
      </h1>

      {intro?.content && (
        <div className="max-w-3xl mx-auto text-gray-800 mb-12 leading-relaxed">
          <MarkdownContent>{intro.content}</MarkdownContent>
        </div>
      )}

      {activities.length === 0 && (
        <p className="text-center text-gray-500 py-16">No recent activities yet.</p>
      )}

      <div className="space-y-10 max-w-4xl mx-auto">
        {activities.map((activity) => {
          const dateStr = activity.publishedAt
            ? new Date(activity.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : null;

          return (
            <article
              key={activity.id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              {/* ── Card header: title + date + content ── */}
              <div className="px-6 py-6 md:px-8 md:py-8">
                <h2 className="text-2xl md:text-3xl font-bold text-ieee-navy leading-snug whitespace-pre-wrap break-words">
                  {activity.title}
                </h2>

                {dateStr && (
                  <p className="mt-1 text-sm text-gray-500">{dateStr}</p>
                )}

                <hr className="my-4 border-gray-100" />

                <div className="text-gray-800 leading-relaxed">
                  <MarkdownContent>{activity.content}</MarkdownContent>
                </div>
              </div>

              {/* ── Images grid ── */}
              {activity.images.length > 0 && (
                <div
                  className={
                    activity.images.length === 1
                      ? "px-6 pb-6 md:px-8 md:pb-8"
                      : `grid gap-1 ${
                          activity.images.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-2 sm:grid-cols-3"
                        }`
                  }
                >
                  {activity.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={
                        activity.images.length === 1
                          ? "overflow-hidden rounded-lg border border-gray-100"
                          : "overflow-hidden aspect-video"
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={`${activity.title} — photo ${idx + 1}`}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* ── PDF buttons ── */}
              {activity.pdfUrl && (
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  {activity.images.length > 0 && <div className="mt-5" />}
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <iframe
                      src={activity.pdfUrl}
                      title={`${activity.title} PDF`}
                      className="w-full h-[560px] border-0"
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
