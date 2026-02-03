import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";
import { FUNCTIONAL_ROLES } from "@/lib/utils";

export function FunctionalTeamSection({ members }: { members: TeamMemberItem[] }) {
  if (members.length === 0) return null;

  const byRole = FUNCTIONAL_ROLES.map((role) => ({
    role,
    members: members.filter((m) => m.post === role),
  })).filter((g) => g.members.length > 0);

  const other = members.filter(
    (m) => !FUNCTIONAL_ROLES.includes(m.post as (typeof FUNCTIONAL_ROLES)[number])
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-ieee-navy border-b-2 border-ieee-red/30 pb-2 mb-8">
        Functional Team
      </h2>
      <div className="space-y-10">
        {byRole.map(({ role, members: roleMembers }) => (
          <div key={role}>
            <h3 className="text-lg font-semibold text-ieee-navy mb-4">{role}</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {roleMembers.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        ))}
        {other.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-ieee-navy mb-4">Other</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {other.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
