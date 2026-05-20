import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { prisma } from "./prisma";

type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

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

        const isProduction = process.env.NODE_ENV === "production";
        if (isProduction && !process.env.NEXTAUTH_SECRET?.trim()) {
          console.error("[auth] NEXTAUTH_SECRET must be set in production");
          return null;
        }

        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user && !isProduction) {
            const passwordHash = await hash(password, 12);
            user = await prisma.user.create({
              data: { email, passwordHash, name: "Admin", role: "ADMIN" },
            });
          }

          if (!user || user.role !== "ADMIN") return null;

          const ok = await compare(password, user.passwordHash);
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          } satisfies AuthUser;
        } catch {
          if (
            !isProduction &&
            email === "admin@ieee.lnmiit.ac.in" &&
            password === "admin123"
          ) {
            return {
              id: "dev-admin",
              email: "admin@ieee.lnmiit.ac.in",
              name: "Admin (demo)",
              role: "ADMIN",
            } satisfies AuthUser;
          }
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    // Step 1: user → JWT
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        token.id = u.id;
        token.email = u.email ?? undefined;
        token.role = u.role;
      }
      return token;
    },

    // Step 2: JWT → session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
