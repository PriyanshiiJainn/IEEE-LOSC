import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let eventsCount = 0, teamCount = 0, submissionsCount = 0, registrationsCount = 0;
  let dbReachable = true;
  try {
    [eventsCount, teamCount, submissionsCount, registrationsCount] = await Promise.all([
      prisma.event.count(),
      prisma.teamMember.count(),
      prisma.contactSubmission.count(),
      prisma.eventRegistration.count(),
    ]);
  } catch {
    dbReachable = false;
  }

  const manageSections = [
    { href: "/admin/events", label: "Events", description: "Add, edit, delete events. Set registration open/closed.", count: eventsCount },
    { href: "/admin/team", label: "Team", description: "Add, edit, delete team members (Faculty, Core, Functional).", count: teamCount },
    { href: "/admin/event-reports", label: "MOM", description: "Add, edit, delete MOM and event reports (optional event link, PDF upload).", count: null },
    { href: "/admin/recent-activity", label: "Recent Activities", description: "Add, edit, delete recent activities with PDF uploads.", count: null },
    { href: "/admin/flash", label: "Flash banner", description: "Set one active banner on the home page (link to event or URL).", count: null },
    { href: "/admin/about", label: "About", description: "Edit About us and About Optica (home page content).", count: null },
    { href: "/admin/gallery", label: "Gallery", description: "Add and manage images shown on the public gallery page.", count: null },
  ];

  const viewSections = [
    { href: "/admin/registrations", label: "Event registrations", description: "View and filter registrations by event.", count: registrationsCount },
    { href: "/admin/submissions", label: "Contact submissions", description: "View contact form submissions.", count: submissionsCount },
  ];

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Counts show 0. Add events, team, etc. once the database is reachable (resume Neon project or check DATABASE_URL).
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Admin dashboard</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-ieee-navy mb-3">Manage content (CRUD)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {manageSections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-ieee-red/50 hover:shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{s.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{s.description}</p>
                </div>
                {s.count != null && (
                  <span className="shrink-0 rounded bg-ieee-red/10 px-2 py-0.5 text-sm font-medium text-ieee-red">{s.count}</span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-ieee-red">Manage →</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ieee-navy mb-3">View data</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {viewSections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-ieee-red/50 hover:shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{s.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{s.description}</p>
                </div>
                {s.count != null && (
                  <span className="shrink-0 rounded bg-ieee-red/10 px-2 py-0.5 text-sm font-medium text-ieee-red">{s.count}</span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-ieee-red">View →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
