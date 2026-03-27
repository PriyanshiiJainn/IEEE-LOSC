import type { TeamMemberItem } from "@/lib/data";

export function ContactInfo({ members }: { members: TeamMemberItem[] }) {
  const seen = new Set<string>();
  const unique = members.filter((m) => {
    const key = m.email ?? m.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <ul className="space-y-3">
      {unique.map((m) => {
        const primaryHref = m.email
          ? `mailto:${m.email}`
          : m.phone
            ? `tel:${m.phone}`
            : undefined;

        const content = (
          <>
            <span className="font-medium text-ieee-navy">{m.name}</span>
            {m.post && (
              <span className="text-gray-800 text-sm ml-2">— {m.post}</span>
            )}
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-800">
              {m.email && <span className="hover:text-ieee-red">{m.email}</span>}
              {m.phone && <span className="hover:text-ieee-red">{m.phone}</span>}
            </div>
          </>
        );

        return (
          <li
            key={m.id}
            className="rounded border border-gray-200"
          >
            <div className="p-3">{content}</div>
          </li>
        );
      })}
    </ul>
  );
}
