import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { RecentActivitiesManager, type Activity } from "@/components/admin/RecentActivitiesManager";

type RecentActivityIntroRow = { id: string; content: string };

type PrismaWithRecentActivity = typeof prisma & {
  recentActivityIntro: {
    findFirst: () => Promise<RecentActivityIntroRow | null>;
  };
  recentActivity: {
    findMany: (args: { orderBy: { publishedAt: "asc" | "desc" } }) => Promise<Activity[]>;
  };
};

export default async function AdminRecentActivityPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let activities: Activity[] = [];
  let dbReachable = true;
  let intro: { id: string; content: string } | null = null;
  try {
    const db = prisma as PrismaWithRecentActivity;
    intro = await db.recentActivityIntro.findFirst();
    activities = await db.recentActivity.findMany({
      orderBy: { publishedAt: "desc" },
    });
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
