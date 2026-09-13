export type ContactEntry = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
};

/**
 * The contact list.
 *
 * Nothing is filled in on the reader's behalf: a field the admin left blank is
 * left out of the markup entirely rather than rendered as a dash or an empty
 * line. Spacing is preserved the same way it is everywhere else on the site.
 */
export function ContactInfo({ people }: { people: ContactEntry[] }) {
  if (people.length === 0) {
    return <p className="text-sm text-gray-600">Contact details will be added soon.</p>;
  }

  return (
    <ul className="space-y-3">
      {people.map((p) => (
        <li key={p.id} className="rounded border border-gray-200">
          <div className="p-3">
            <span className="font-medium text-ieee-navy whitespace-pre-wrap break-words">
              {p.name}
            </span>
            {p.designation && (
              <span className="ml-2 text-sm text-gray-800 whitespace-pre-wrap break-words">
                — {p.designation}
              </span>
            )}

            {(p.email || p.phone) && (
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-800">
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="break-all hover:text-ieee-red hover:underline"
                  >
                    {p.email}
                  </a>
                )}
                {p.phone && (
                  <a
                    href={`tel:${p.phone.replace(/\s+/g, "")}`}
                    className="break-words hover:text-ieee-red hover:underline"
                  >
                    {p.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
