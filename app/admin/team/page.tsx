import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { TeamManager } from "@/components/admin/TeamManager";
import { TEAM_CLASSIFICATIONS } from "@/lib/utils";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let members: Awaited<ReturnType<typeof prisma.teamMember.findMany>> = [];
  let dbReachable = true;
  try {
    members = await prisma.teamMember.findMany({
      orderBy: [{ classification: "asc" }, { order: "asc" }],
    });
  } catch {
    dbReachable = false;
  }
  const classifications = TEAM_CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label }));

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Data will appear when the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage team</h1>
      <TeamManager initialMembers={members} classifications={classifications} />
    </div>
  );
}
