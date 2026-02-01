import Link from "next/link";

type FooterLink = { label: string; url: string };

const defaultLinks: FooterLink[] = [
  { label: "IEEE", url: "https://www.ieee.org/" },
  { label: "LNMIIT", url: "https://www.lnmiit.ac.in/" },
];

export async function Footer() {
  let links: FooterLink[] = defaultLinks;
  try {
    const { prisma } = await import("@/lib/prisma");
    const dbLinks = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
    if (dbLinks.length > 0) links = dbLinks.map((l) => ({ label: l.label, url: l.url }));
  } catch {
    // no DB or not migrated yet
  }

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
