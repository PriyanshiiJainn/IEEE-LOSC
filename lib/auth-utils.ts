  import { getServerSession } from "next-auth";
  import { authOptions } from "./auth";

  export async function getAdminSession() {
    return getServerSession(authOptions);
  }

  /** Use in API routes: returns session or null. If null, respond with 401 and return null. */
  export async function requireAdmin(
    request?: Request
  ): Promise<{ id: string; email: string | null } | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;
    return { id: session.user.id, email: session.user.email ?? null };
  }
