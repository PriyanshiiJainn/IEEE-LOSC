import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth-utils";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const isDemoSession = session.user?.id === "dev-admin";

  return (
    <div>
      <h1 className="text-2xl font-bold text-ieee-navy mb-2">Account</h1>
      <p className="text-sm text-gray-600 mb-6">
        Signed in as <span className="font-medium text-gray-900">{session.user?.email}</span>
      </p>

      {isDemoSession ? (
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You are in demo login mode (database unavailable). Connect the database and sign in with
          a seeded admin account to change your password.
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold text-ieee-navy mb-4">Change password</h2>
          <ChangePasswordForm />
        </section>
      )}
    </div>
  );
}
