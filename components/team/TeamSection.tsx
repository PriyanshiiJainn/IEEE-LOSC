import type { TeamMemberItem } from "@/lib/data";
import { TeamCard } from "./TeamCard";

export function TeamSection({
  title,
  members,
  singleCard,
}: {
  title: string;
  members: TeamMemberItem[];
  singleCard?: boolean;
}) {
  if (members.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold text-ieee-navy border-b-2 border-ieee-red/30 pb-2 mb-8">
        {title}
      </h2>
      <div
        className={
          singleCard
            ? "grid gap-6 max-w-sm mx-auto"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        }
      >
        {members.map((m) => (
          <TeamCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}
