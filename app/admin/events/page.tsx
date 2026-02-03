import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { EventsManager } from "@/components/admin/EventsManager";
import { EVENT_CATEGORIES } from "@/lib/utils";

export default async function AdminEventsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let dbReachable = true;
  try {
    events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  } catch {
    dbReachable = false;
  }
  const categories = EVENT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Add events once the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage events</h1>
      <EventsManager initialEvents={events} categories={categories} />
    </div>
  );
}
