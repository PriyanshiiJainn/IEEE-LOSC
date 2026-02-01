import { getFooterLinks } from "@/lib/data";

export async function Footer() {
  const links = await getFooterLinks();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            IEEE Student Chapter · The LNM Institute of Information Technology, Jaipur
          </p>
          <div className="flex flex-wrap gap-6">
            <span className="text-sm font-medium text-gray-700">Useful links</span>
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ieee-red hover:underline"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
