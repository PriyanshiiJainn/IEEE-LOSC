import type { TeamMemberItem } from "@/lib/data";

export function TeamSection({
  title,
  members,
}: {
  title: string;
  members: TeamMemberItem[];
}) {
  if (members.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-ieee-navy border-b border-gray-200 pb-2 mb-6">
        {title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="font-semibold text-ieee-navy">{m.name}</div>
            {m.post && (
              <div className="text-sm text-ieee-red mt-1">{m.post}</div>
            )}
            {m.email && (
              <a
                href={`mailto:${m.email}`}
                className="text-sm text-gray-600 hover:text-ieee-red mt-2 block"
              >
                {m.email}
              </a>
            )}
            {m.phone && (
              <a
                href={`tel:${m.phone}`}
                className="text-sm text-gray-600 hover:text-ieee-red block"
              >
                {m.phone}
              </a>
            )}
            {m.linkedin && (
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ieee-red hover:underline mt-1 inline-block"
              >
                LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
