import { getFooterLinks, getFooterSettings } from "@/lib/data";

export async function Footer() {
  const [links, settings] = await Promise.all([getFooterLinks(), getFooterSettings()]);

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {settings.copyrightText}
          </p>
          <div className="flex flex-wrap gap-6">
            {settings.linksHeading && (
              <span className="text-sm font-medium text-gray-700 whitespace-pre-wrap break-words">
                {settings.linksHeading}
              </span>
            )}
            {links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ieee-red hover:underline whitespace-pre-wrap break-words"
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
