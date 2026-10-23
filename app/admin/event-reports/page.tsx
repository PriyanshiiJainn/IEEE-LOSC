import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { EventReportsManager, type Report, type Notice } from "@/components/admin/EventReportsManager";

export default async function AdminEventReportsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let reports: Report[] = [];
  let events: { id: string; title: string }[] = [];
  let notices: Notice[] = [];
  let dbReachable = true;

  try {
    const [reportsData, eventsData, noticesData] = await Promise.all([
      prisma.eventReport.findMany({
        include: { event: { select: { id: true, title: true } } },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
      prisma.notice.findMany({ orderBy: { publishedAt: "desc" } }),
    ]);
    reports = reportsData as Report[];
    events = eventsData;
    notices = noticesData as Notice[];
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage MOM &amp; Event Reports</h1>
      <EventReportsManager
        initialReports={reports}
        initialNotices={notices}
        events={events}
      />
    </div>
  );
}
