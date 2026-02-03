import type { TeamMemberItem } from "@/lib/data";

const PLACEHOLDER_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c41230' opacity='0.3'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

export function TeamCard({ member }: { member: TeamMemberItem }) {
  const imageSrc = member.imageUrl || PLACEHOLDER_AVATAR;

  return (
    <article className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="aspect-[3/4] relative bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-ieee-navy">{member.name}</h3>
        {member.post && (
          <p className="text-sm text-ieee-red mt-1">{member.post}</p>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-xs text-gray-500 hover:text-ieee-red mt-2 inline-block"
          >
            {member.email}
          </a>
        )}
      </div>
    </article>
  );
}
