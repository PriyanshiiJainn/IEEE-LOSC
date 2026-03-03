import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

export function TeamSection({
  title,
  members,
  singleCard,
  className,
  nameClassName,
  splitName,
  cols,
}: {
  title: string;
  members: TeamMemberItem[];
  singleCard?: boolean;
  className?: string;
  nameClassName?: string;
  splitName?: boolean;
  cols?: number;
}) {
  if (members.length === 0) return null;

  return (
    <section className={className ?? "mb-16"}>
      <h2 className="text-[clamp(1.25rem,3vw,2rem)] font-bold text-[#000080] border-b-2 border-ieee-red/30 pb-3 mb-10 text-center">
        {title}
      </h2>

      <div
        className={
          singleCard
            ? "flex justify-center"
            : cols
              ? "mx-auto flex flex-wrap justify-center gap-5"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center"
        }
        style={cols ? { maxWidth: `${cols * 13 + (cols - 1) * 1.25}rem` } : undefined}
      >
        {members.map((m) => (
          <div key={m.id} className={singleCard ? "w-72" : "w-52"}>
            <TeamCard member={m} nameClassName={nameClassName} splitName={splitName} />
          </div>
        ))}
      </div>
    </section>
  );
}
