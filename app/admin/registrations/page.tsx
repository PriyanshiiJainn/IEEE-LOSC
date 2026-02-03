import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ eventId?: string }> };

export default async function AdminRegistrationsPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { eventId: filterEventId } = await searchParams;

  let registrations: Awaited<ReturnType<typeof prisma.eventRegistration.findMany>> = [];
  let events: { id: string; title: string }[] = [];
  let dbReachable = true;
  try {
    [registrations, events] = await Promise.all([
      prisma.eventRegistration.findMany({
        where: filterEventId ? { eventId: filterEventId } : undefined,
        include: { event: { select: { id: true, title: true, date: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({ orderBy: { date: "desc" }, select: { id: true, title: true } }),
    ]);
  } catch {
    dbReachable = false;
  }

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Registrations will appear when the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-4">Event registrations</h1>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium">Filter by event:</span>{" "}
        <Link href="/admin/registrations" className={!filterEventId ? "text-ieee-red font-medium" : "text-ieee-red hover:underline"}>
          All
        </Link>
        {events.map((ev) => (
          <span key={ev.id}>
            {" · "}
            <Link
              href={`/admin/registrations?eventId=${encodeURIComponent(ev.id)}`}
              className={filterEventId === ev.id ? "text-ieee-red font-medium" : "text-ieee-red hover:underline"}
            >
              {ev.title}
            </Link>
          </span>
        ))}
      </p>
      {registrations.length === 0 ? (
        <p className="text-gray-500">
          {filterEventId ? "No registrations for this event." : "No registrations yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => (
            <div key={r.id} className="rounded border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="font-medium text-gray-900">{r.name}</span>
                <span>{r.email}</span>
                <span>Roll: {r.rollNo}</span>
                <span>{r.phone}</span>
                <span className="text-ieee-red font-medium">{r.event?.title ?? "—"}</span>
                <span>{r.event?.date != null ? new Date(r.event.date).toLocaleDateString() : "—"}</span>
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
