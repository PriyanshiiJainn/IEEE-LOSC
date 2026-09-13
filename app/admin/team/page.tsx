import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { TeamManager } from "@/components/admin/TeamManager";
import { AcademicYearBar } from "@/components/admin/AcademicYearBar";
import {
  TEAM_CLASSIFICATIONS,
  currentAcademicYear,
  nextAcademicYear,
  sortAcademicYearsDesc,
} from "@/lib/utils";

type Member = Awaited<ReturnType<typeof prisma.teamMember.findMany>>[number];

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { year } = await searchParams;

  let allMembers: Member[] = [];
  let registeredYears: string[] = [];
  let dbReachable = true;
  try {
    const [members, years] = await Promise.all([
      prisma.teamMember.findMany({
        orderBy: [{ classification: "asc" }, { order: "asc" }],
      }),
      prisma.academicYear.findMany({ select: { year: true } }),
    ]);
    allMembers = members;
    registeredYears = years.map((y) => y.year);
  } catch {
    dbReachable = false;
  }

  const years = sortAcademicYearsDesc([
    ...new Set([...registeredYears, ...allMembers.map((m) => m.academicYear)]),
  ]);
  const fallbackYear = currentAcademicYear();
  const yearOptions = years.length > 0 ? years : [fallbackYear];
  const selectedYear =
    year && yearOptions.includes(year) ? year : (yearOptions[0] ?? fallbackYear);

  const counts: Record<string, number> = {};
  for (const y of yearOptions) counts[y] = 0;
  for (const m of allMembers) counts[m.academicYear] = (counts[m.academicYear] ?? 0) + 1;

  const members = allMembers.filter((m) => m.academicYear === selectedYear);

  // Category names already in use, offered as suggestions per classification.
  const categorySuggestions: Record<string, string[]> = {};
  for (const m of allMembers) {
    const category = m.category?.trim();
    if (!category) continue;
    const list = (categorySuggestions[m.classification] ??= []);
    if (!list.includes(category)) list.push(category);
  }
  for (const list of Object.values(categorySuggestions)) list.sort((a, b) => a.localeCompare(b));

  const classifications = TEAM_CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label }));

  return (
    <div>
      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Data will appear when the database is reachable.
        </div>
      )}
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Manage team</h1>

      <AcademicYearBar
        years={yearOptions}
        counts={counts}
        selected={selectedYear}
        suggested={nextAcademicYear(yearOptions)}
      />

      <TeamManager
        key={selectedYear}
        initialMembers={members}
        classifications={classifications}
        years={yearOptions}
        academicYear={selectedYear}
        categorySuggestions={categorySuggestions}
      />
    </div>
  );
}
