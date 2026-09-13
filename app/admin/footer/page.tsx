import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/data";
import { FooterLinksManager } from "@/components/admin/FooterLinksManager";
import { FooterTextEditor } from "@/components/admin/FooterTextEditor";

type FooterSettingsRow = { copyrightText: string; linksHeading: string };

type PrismaWithFooterSettings = typeof prisma & {
  footerSettings: { findFirst: () => Promise<FooterSettingsRow | null> };
};

export default async function AdminFooterPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let links: { id: string; label: string; url: string; order: number }[] = [];
  let settings: FooterSettingsRow = DEFAULT_FOOTER_SETTINGS;
  let dbReachable = true;
  try {
    const db = prisma as PrismaWithFooterSettings;
    const [linkRows, settingsRow] = await Promise.all([
      prisma.footerLink.findMany({ orderBy: { order: "asc" } }),
      db.footerSettings.findFirst(),
    ]);
    links = linkRows;
    if (settingsRow) {
      settings = {
        copyrightText: settingsRow.copyrightText || DEFAULT_FOOTER_SETTINGS.copyrightText,
        linksHeading: settingsRow.linksHeading ?? DEFAULT_FOOTER_SETTINGS.linksHeading,
      };
    }
  } catch {
    dbReachable = false;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ieee-navy mb-6">Footer</h1>

      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. The footer is showing its built-in defaults; changes cannot be saved
          until the database is reachable.
        </div>
      )}

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-ieee-navy mb-1">Footer text</h2>
        <p className="mb-4 text-sm text-gray-500">
          The chapter/copyright line and the heading above the other links.
        </p>
        <FooterTextEditor
          initialCopyrightText={settings.copyrightText}
          initialLinksHeading={settings.linksHeading}
        />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-ieee-navy mb-1">Other links</h2>
        <p className="mb-4 text-sm text-gray-500">
          Links shown on the right of the footer. Lower order numbers appear first.
        </p>
        <FooterLinksManager initialLinks={links} />
      </section>
    </div>
  );
}
