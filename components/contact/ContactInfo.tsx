import type { TeamMemberItem } from "@/lib/data";

export function ContactInfo({ members }: { members: TeamMemberItem[] }) {
  return (
    <ul className="space-y-3">
      {members.map((m) => (
        <li key={m.id} className="rounded border border-gray-200 p-3">
          <span className="font-medium text-ieee-navy">{m.name}</span>
          {m.post && <span className="text-gray-600 text-sm ml-2">— {m.post}</span>}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {m.email && (
              <a href={`mailto:${m.email}`} className="hover:text-ieee-red">
                {m.email}
              </a>
            )}
            {m.phone && (
              <a href={`tel:${m.phone}`} className="hover:text-ieee-red">
                {m.phone}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
