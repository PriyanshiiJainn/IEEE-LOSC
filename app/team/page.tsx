import { getTeamAcademicYears, getTeamMembers } from "@/lib/data";
import { TeamSection } from "@/components/team/TeamSection";
import { TeamYearSelect } from "@/components/team/TeamYearSelect";
import { currentAcademicYear } from "@/lib/utils";

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;
  const years = await getTeamAcademicYears();

  // The newest year the admin has created, whether or not its team is filled in yet.
  const latestYear = years[0] ?? currentAcademicYear();
  const selectedYear = year && years.includes(year) ? year : latestYear;

  const members = await getTeamMembers(selectedYear);

  const faculty = members.filter(
    (m) => m.classification === "FACULTY_ADVISOR"
  );
  const core = members.filter((m) => m.classification === "CORE");
  const functional = members.filter(
    (m) => m.classification === "FUNCTIONAL"
  );

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-heading text-ieee-navy text-center">
        Our Team
      </h1>

      {/* Academic-year picker, right-aligned under the heading */}
      <div className="mt-3 mb-10 flex justify-end">
        <TeamYearSelect years={years} selected={selectedYear} />
      </div>

      {members.length === 0 ? (
        <p className="py-10 text-center text-gray-600">
          Team info not available for {selectedYear}.
        </p>
      ) : (
        <>
          <TeamSection
            title="FACULTY ADVISOR"
            className="mb-14"
            members={faculty}
            nameClassName="md:text-2xl"
            singleCard
          />

          <TeamSection
            title="CORE TEAM"
            className="mb-16"
            members={core}
            nameClassName="md:text-2xl"
            cols={3}
          />

          <TeamSection title="FUNCTIONAL TEAM" members={functional} wrap />
        </>
      )}
    </section>
  );
}
