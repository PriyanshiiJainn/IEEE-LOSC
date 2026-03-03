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
    <div className="w-full">
      {/* Main Heading */}
      <h2 className="text-center text-[clamp(1.25rem,3vw,2rem)] font-bold text-[#000080] border-b-2 border-ieee-red/30 pb-2 mb-12">
        FUNCTIONAL TEAM
      </h2>

      <div className="space-y-20">
        {FUNCTIONAL_TEAMS.map((team) => {
          const teamMembers = functionalMembers.filter((m) => {
            if (!m.post) return false;
            const post = m.post.toLowerCase();
            return team.keywords.some((k) => post.includes(k));
          });

          if (teamMembers.length === 0) return null;

          return (
            <section key={team.name} className="text-center">
              {/* Team Heading */}
              <h3 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold text-ieee-navy mb-4">
                {team.name} Team
              </h3>

              {/* Centered Grid */}
              <div className="flex flex-wrap justify-center gap-5">
                {teamMembers.map((m) => (
                  <div key={m.id} className="w-52">
                    <TeamCard member={m} splitName />
                  </div>
                ))}
              </div>


            </section>
          );
        })}
      </div>
    </div>
  );
}
