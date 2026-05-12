import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let submissions: Awaited<ReturnType<typeof prisma.contactSubmission.findMany>> = [];
  type RegistrationWithEvent = Awaited<
    ReturnType<
      typeof prisma.eventRegistration.findMany<{
        include: { event: { select: { id: true; title: true; date: true } } };
      }>
    >
  >[number];
  let registrations: RegistrationWithEvent[] = [];
  let dbReachable = true;
  try {
    const [contactData, registrationData] = await Promise.all([
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.eventRegistration.findMany({
        include: { event: { select: { id: true, title: true, date: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    submissions = contactData;
    registrations = registrationData;
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Submissions</h1>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ieee-navy">Event registrations</h2>
          <Link href="/admin/registrations" className="text-sm font-medium text-ieee-red hover:underline">
            Open dedicated registrations page
          </Link>
        </div>
        {registrations.length === 0 ? (
          <p className="text-gray-500">{dbReachable ? "No event registrations yet." : "Database unreachable."}</p>
        ) : (
          <div className="space-y-4">
            {registrations.map((r) => (
              <div key={r.id} className="rounded border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
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
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ieee-navy mb-3">Contact form submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500">{dbReachable ? "No contact submissions yet." : "Database unreachable."}</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s.id} className="rounded border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="font-medium text-gray-900">{s.name}</span>
                  <span>{s.email}</span>
                  {s.subject && <span>— {s.subject}</span>}
                  <span>{new Date(s.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{s.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
