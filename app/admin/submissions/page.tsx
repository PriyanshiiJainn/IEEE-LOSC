import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export default async function AdminSubmissionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let submissions: Awaited<ReturnType<typeof prisma.contactSubmission.findMany>> = [];
  let dbReachable = true;
  try {
    submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Contact form submissions</h1>
      {submissions.length === 0 ? (
        <p className="text-gray-500">{dbReachable ? "No submissions yet." : "Database unreachable."}</p>
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
    </div>
  );
}
