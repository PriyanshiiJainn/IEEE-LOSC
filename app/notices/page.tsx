import { getNotices } from "@/lib/data";
import { NoticeCard } from "@/components/notices/NoticeCard";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-4">
        Notices
      </h1>
      <p className="max-w-4xl mx-auto text-red-500 mb-10 text-center">
        Official notices and announcements from the LNMIIT Optica Student Chapter
      </p>

      {notices.length === 0 ? (
        <p className="text-gray-700">No notices published yet.</p>
      ) : (
        <div className="space-y-8">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </section>
  );
}
