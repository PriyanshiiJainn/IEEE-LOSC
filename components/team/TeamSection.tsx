import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

type Layout = {
  singleCard?: boolean;
  /** Centred wrapping row, optionally capped to this many cards wide. */
  wrap?: boolean;
  cols?: number;
  nameClassName?: string;
};

/**
 * Splits a section's members into the ones shown directly under the section
 * heading and the admin-defined categories ("Web Development Team",
 * "Sponsorship Team", …) shown under their own sub-heading. Categories are
 * ordered by the lowest Order value among their members.
 */
function groupByCategory(members: TeamMemberItem[]) {
  const uncategorized: TeamMemberItem[] = [];
  const byCategory = new Map<string, TeamMemberItem[]>();

  for (const member of members) {
    const category = member.category?.trim();
    if (!category) {
      uncategorized.push(member);
      continue;
    }
    const existing = byCategory.get(category);
    if (existing) existing.push(member);
    else byCategory.set(category, [member]);
  }

  const categories = [...byCategory.entries()]
    .map(([name, list]) => ({
      name,
      members: list,
      rank: Math.min(...list.map((m) => m.order)),
    }))
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));

  return { uncategorized, categories };
}

function CardGrid({
  members,
  singleCard,
  wrap,
  cols,
  nameClassName,
}: Layout & { members: TeamMemberItem[] }) {
  const className = singleCard
    ? "flex justify-center"
    : cols || wrap
      ? "mx-auto flex flex-wrap justify-center gap-5"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center";

  return (
    <div
      className={className}
      style={cols ? { maxWidth: `${cols * 13 + (cols - 1) * 1.25}rem` } : undefined}
    >
      {members.map((m) => (
        <div key={m.id} className={singleCard ? "w-72" : "w-52"}>
          <TeamCard member={m} nameClassName={nameClassName} />
        </div>
      ))}
    </div>
  );
}

export function TeamSection({
  title,
  members,
  className,
  ...layout
}: Layout & {
  title: string;
  members: TeamMemberItem[];
  className?: string;
}) {
  if (members.length === 0) return null;

  const { uncategorized, categories } = groupByCategory(members);

  return (
    <section className={className ?? "mb-16"}>
      <h2 className="text-[clamp(1.25rem,3vw,2rem)] font-bold text-[#000080] border-b-2 border-ieee-red/30 pb-3 mb-10 text-center">
        {title}
      </h2>

      {uncategorized.length > 0 && <CardGrid members={uncategorized} {...layout} />}

      {categories.length > 0 && (
        <div className={uncategorized.length > 0 ? "mt-16 space-y-16" : "space-y-16"}>
          {categories.map((category) => (
            <section key={category.name} className="text-center">
              <h3 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold text-ieee-navy mb-4 whitespace-pre-wrap break-words">
                {category.name}
              </h3>
              <CardGrid members={category.members} {...layout} />
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
