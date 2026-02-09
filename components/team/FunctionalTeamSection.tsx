import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";
import { FUNCTIONAL_ROLES } from "@/lib/utils";

const FUNCTIONAL_TEAMS = [
  { name: "Web Development", keywords: ["web"] },
  { name: "Content Creation", keywords: ["content"] },
  { name: "Event Management", keywords: ["event"] },
];

export function FunctionalTeamSection({
  members,
}: {
  members: TeamMemberItem[];
}) {
  const functionalMembers = members.filter(
    (m) => m.classification === "FUNCTIONAL"
  );

  if (functionalMembers.length === 0) return null;

  return (
    <div>
      <h2 className="flex justify-center items-center text-4xl font-bold text-ieee-navy border-b-2 border-ieee-red/30 pb-2 mb-8 font-times">
        Functional Team
      </h2>

      <div className="space-y-16">
        {FUNCTIONAL_TEAMS.map((team) => {
          const teamMembers = functionalMembers.filter((m) => {
            if (!m.post) return false;
            const post = m.post.toLowerCase();
            return team.keywords.some((k) => post.includes(k));
          });

          if (teamMembers.length === 0) return null;

          return (
            <section key={team.name}>
              <h3 className="text-3xl font-semibold text-ieee-navy mb-8">
                {team.name} Team
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {teamMembers.map((m) => (
                  <TeamCard key={m.id} member={m} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
