import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

export function TeamSection({
  title,
  members,
  singleCard,
  className,
  nameClassName,
  splitName,
}: {
  title: string;
  members: TeamMemberItem[];
  singleCard?: boolean;
  className?: string;
  nameClassName?: string;
  splitName?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <section className={className ?? "mb-16"}>
      <h2 className="text-[3vw] font-bold text-[#000080] border-b-2 border-ieee-red/30 pb-3 mb-10 text-center">
        {title}
      </h2>

      <div
        className={
          singleCard
            ? "flex justify-center"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 justify-items-center"
        }
      >
        {members.map((m) => (
          <div key={m.id} className={singleCard ? "w-56" : "w-52"}>
            <TeamCard member={m} nameClassName={nameClassName} splitName={splitName} />
          </div>
        ))}
      </div>
    </section>
  );
}
