import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { FlashManager, type Flash } from "@/components/admin/FlashManager";

export default async function AdminFlashPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let flashItems: Flash[] = [];
  let events: { id: string; title: string }[] = [];
  let dbReachable = true;
  try {
    const [flashData, eventsData] = await Promise.all([
      prisma.flashAnnouncement.findMany({
        include: { event: { select: { id: true, title: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
    ]);
    flashItems = flashData as Flash[];
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Home page flash banner</h1>
      <FlashManager initialFlash={flashItems} events={events} />
    </div>
  );
}
