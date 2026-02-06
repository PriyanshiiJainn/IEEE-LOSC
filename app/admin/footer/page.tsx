import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { FooterLinksManager } from "@/components/admin/FooterLinksManager";

export default async function AdminFooterPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const links = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ieee-navy mb-6 font-times">Footer useful links</h1>
      <FooterLinksManager initialLinks={links} />
    </div>
  );
}
