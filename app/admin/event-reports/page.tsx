import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { EventReportsManager, type Report } from "@/components/admin/EventReportsManager";

export default async function AdminEventReportsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let reports: Report[] = [];
  let events: { id: string; title: string }[] = [];
  let dbReachable = true;
  try {
    const [reportsData, eventsData] = await Promise.all([
      prisma.eventReport.findMany({
        include: { event: { select: { id: true, title: true } } },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
    ]);
    reports = reportsData as Report[];
    events = eventsData;
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage event reports</h1>
      <EventReportsManager initialReports={reports} events={events} />
    </div>
  );
}
