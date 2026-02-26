import { getTeamMembers } from "@/lib/data";
import { TeamSection } from "@/components/team/TeamSection";
import { FunctionalTeamSection } from "@/components/team/FunctionalTeamSection";

export default async function TeamPage() {
  const members = await getTeamMembers();

  const faculty = members.filter(
    (m) => m.classification === "FACULTY_ADVISOR"
  );
  const core = members.filter((m) => m.classification === "CORE");
  const functional = members.filter(
    (m) => m.classification === "FUNCTIONAL"
  );

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-6xl font-bold text-ieee-navy text-center mb-10">
        Our Team
      </h1>

      {/* Faculty Advisor section */}
      <TeamSection
        title="FACULTY ADVISOR"
        className="mb-14"
        members={faculty}
        nameClassName="md:text-2xl"
        singleCard
      
      />

      {/* Core Team section */}
      {/* Core Team section */}
<TeamSection
  title="CORE TEAM"
  className="mb-16"
  members={core}
  nameClassName="md:text-2xl" // only Core Team names bigger
/>



      {/* Functional Team section */}
      <FunctionalTeamSection members={functional} />
    </section>
  );
}
