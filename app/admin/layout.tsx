import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { SessionProvider } from "@/components/providers/SessionProvider";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/registrations", label: "Registrations" },
    { href: "/admin/team", label: "Team" },
    { href: "/admin/event-reports", label: "Event Reports" },
    { href: "/admin/flash", label: "Flash" },
    { href: "/admin/about", label: "About" },
    { href: "/admin/submissions", label: "Submissions" },
  ];

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        {session && (
          <header className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="container mx-auto flex items-center justify-between">
              <nav className="flex flex-wrap gap-4">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-sm font-medium text-gray-600 hover:text-ieee-red"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{session.user?.email}</span>
                <Link
                  href="/api/auth/signout"
                  className="text-sm text-gray-500 hover:text-ieee-red"
                >
                  Sign out
                </Link>
              </div>
            </div>
          </header>
        )}
        <div className="container mx-auto px-4 py-8">{children}</div>
      </div>
    </SessionProvider>
  );
}
