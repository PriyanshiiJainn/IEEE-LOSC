import { getAdminSession } from "@/lib/auth-utils";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <AdminShell session={session}>{children}</AdminShell>
  );
}
