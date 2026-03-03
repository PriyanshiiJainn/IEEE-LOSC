import type { TeamMemberItem } from "@/lib/data";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c41230' opacity='0.3'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export function TeamCard({
  member,
  nameClassName,
  splitName,
}: {
  member: TeamMemberItem;
  nameClassName?: string;
  splitName?: boolean;
}) {
  const imageSrc = member.imageUrl || PLACEHOLDER_AVATAR;

  const renderedName = member.name.includes("\n")
    ? member.name.split("\n").map((line, i, arr) => (
        <span key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </span>
      ))
    : splitName
      ? (() => {
          const lastIdx = member.name.trim().lastIndexOf(" ");
          if (lastIdx <= 0) return member.name;
          return (
            <>
              {member.name.slice(0, lastIdx)}
              <br />
              {member.name.slice(lastIdx + 1)}
            </>
          );
        })()
      : member.name;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md p-3 transition h-full flex flex-col">
      <div className="aspect-square w-36 mx-auto border-2 border-gray-300 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mt-2">
        <img src={imageSrc} alt="" className="w-full h-full object-cover block" />
      </div>

      <div className="p-3 text-center flex flex-col">
        <h3 className={`font-semibold text-ieee-navy text-lg min-h-[3.5rem] flex items-center justify-center leading-tight ${nameClassName ?? ""}`}>
          <span className="text-center">{renderedName}</span>
        </h3>

        {member.post && (
          <div className="text-sm text-ieee-red mt-1">
            <MarkdownContent>{member.post}</MarkdownContent>
          </div>
        )}
      </div>
    </article>
  );
}
