import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { RecentActivitiesManager, type Activity } from "@/components/admin/RecentActivitiesManager";

export default async function AdminRecentActivityPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let activities: Activity[] = [];
  let dbReachable = true;
  let intro: { id: string; content: string } | null = null;

  try {
    const [rows, introRow] = await Promise.all([
      prisma.recentActivity.findMany({
        orderBy: { publishedAt: "desc" },
        include: { images: { orderBy: { order: "asc" } } },
      }),
      prisma.recentActivityIntro.findFirst(),
    ]);
    // Map to the Activity shape the manager component expects
    activities = rows.map((r) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      pdfUrl: r.pdfUrl,
      publishedAt: r.publishedAt,
      images: r.images.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        order: img.order,
      })),
    }));
    intro = introRow ? { id: introRow.id, content: introRow.content } : null;
  } catch {
    dbReachable = false;
  }

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Data will appear when the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage Recent Activities</h1>
      <RecentActivitiesManager initialActivities={activities} initialIntro={intro} />
    </div>
  );
}
