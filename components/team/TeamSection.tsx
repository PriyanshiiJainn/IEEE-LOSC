import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

export function TeamSection({
  title,
  members,
  singleCard,
  className,
  nameClassName, // new prop
}: {
  title: string;
  members: TeamMemberItem[];
  singleCard?: boolean;
  className?: string;
  nameClassName?: string;
}) {
  if (members.length === 0) return null;

  return (
    <section className={className ?? "mb-16"}>
      <h2 className="text-5xl font-bold text-[#000080] border-b-2 border-ieee-red/30 pb-3 mb-10 text-center">
        {title}
      </h2>

      <div
        className={
          singleCard
            ? "flex justify-center"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center"
        }
      >
        {members.map((m) => (
          <div
            key={m.id}
            className={singleCard ? "w-72 md:w-80 lg:w-96" : "w-60"}
          >
            <TeamCard member={m} nameClassName={nameClassName} />
          </div>
        ))}
      </div>
    </section>
  );
}
