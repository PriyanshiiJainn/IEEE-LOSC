import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { NoticesManager, type Notice } from "@/components/admin/NoticesManager";

export default async function AdminNoticesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let notices: Notice[] = [];
  let dbReachable = true;
  try {
    notices = await prisma.notice.findMany({ orderBy: { publishedAt: "desc" } });
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage Notices</h1>
      <NoticesManager initialNotices={notices} />
    </div>
  );
}
