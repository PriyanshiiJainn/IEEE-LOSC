import { getTeamMembers } from "@/lib/data";
import { TeamSection } from "@/components/team/TeamSection";
import { FunctionalTeamSection } from "@/components/team/FunctionalTeamSection";

export default async function TeamPage() {
  const members = await getTeamMembers();

  const faculty = members.filter((m) => m.classification === "FACULTY_ADVISOR");
  const core = members.filter((m) => m.classification === "CORE");
  const functional = members.filter((m) => m.classification === "FUNCTIONAL");

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-ieee-navy mb-12">Our Team</h1>
      <div className="space-y-14">
        <TeamSection title="Faculty Advisor" members={faculty} singleCard />
        <TeamSection title="Core Team" members={core} />
        <FunctionalTeamSection members={functional} />
      </div>
    </section>
  );
}
