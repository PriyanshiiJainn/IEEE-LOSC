import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  matcher: ["/admin", "/admin/events", "/admin/registrations", "/admin/team", "/admin/event-reports", "/admin/flash", "/admin/about", "/admin/submissions", "/admin/footer"],
};
