import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

export function TeamSection({
  title,
  members,
  singleCard,
  className,
}: {
  title: string;
  members: TeamMemberItem[];
  singleCard?: boolean;
  className?: string;
}) {
  if (members.length === 0) return null;

  return (
    <section className={className ?? "mb-16"}>
      {/* Center the title */}
      <h2 className="text-4xl font-bold text-ieee-navy border-b-2 border-ieee-red/30 pb-3 mb-10 text-center">
        {title}
      </h2>

      <div
        className={
          singleCard
            ? "flex justify-center"
            : "grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }
      >
        {members.map((m) => (
          <div
            key={m.id}
            className={
              singleCard
                ? "w-56 md:w-64"  // smaller fixed width for single card (adjust as needed)
                : ""
            }
          >
            <TeamCard member={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
