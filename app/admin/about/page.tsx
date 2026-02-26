import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { AboutEditor } from "@/components/admin/AboutEditor";

export default async function AdminAboutPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let content: Awaited<ReturnType<typeof prisma.aboutContent.findFirst>> = null;
  let dbReachable = true;
  try {
    content = await prisma.aboutContent.findFirst();
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
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">About us / About Optica / Recent Updates</h1>
      <AboutEditor initial={content} />
    </div>
  );
}
