import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password).trim();
        if (!email || !password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user || user.role !== "ADMIN") return null;
          const ok = await compare(password, user.passwordHash);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name };
        } catch {
          // Dev-only fallback when DB unreachable (e.g. Neon paused / network): allow seed credentials so you can view admin portal
          if (process.env.NODE_ENV === "development" && email === "admin@ieee.lnmiit.ac.in" && password === "admin123") {
            return { id: "dev-admin", email: "admin@ieee.lnmiit.ac.in", name: "Admin (demo)" };
          }
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
