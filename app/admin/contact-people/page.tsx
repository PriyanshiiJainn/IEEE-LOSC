import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { ContactPeopleManager } from "@/components/admin/ContactPeopleManager";

type ContactPersonRow = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  order: number;
};

type PrismaWithContactPerson = typeof prisma & {
  contactPerson: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<ContactPersonRow[]>;
  };
};

export default async function AdminContactPeoplePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  let people: ContactPersonRow[] = [];
  let dbReachable = true;
  try {
    const db = prisma as PrismaWithContactPerson;
    people = await db.contactPerson.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    dbReachable = false;
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-ieee-navy">Contact people</h1>
      <p className="mb-6 text-sm text-gray-500">
        Everyone listed here is shown on the public contact page, in order. Only the name is
        required — blank fields are left off the page entirely.
      </p>

      {!dbReachable && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Database unreachable. Contact people cannot be loaded or saved until the database is
          reachable.
        </div>
      )}

      <ContactPeopleManager initialPeople={people} />
    </div>
  );
}
