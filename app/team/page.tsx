import { getTeamMembers } from "@/lib/data";
import { TeamSection } from "@/components/team/TeamSection";
import { TEAM_CLASSIFICATIONS } from "@/lib/utils";

export default async function TeamPage() {
  const members = await getTeamMembers();

  const byClassification = TEAM_CLASSIFICATIONS.map(({ value, label }) => ({
    label,
    value,
    members: members.filter((m) => m.classification === value),
  }));

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-ieee-navy mb-8">Our Team</h1>
      <div className="space-y-12">
        {byClassification.map((group) => (
          <TeamSection key={group.value} title={group.label} members={group.members} />
        ))}
      </div>
    </section>
  );
}
