import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (admin.id === "dev-admin") {
    return NextResponse.json(
      {
        error:
          "Password cannot be changed in demo mode. Connect the database and sign in with a real admin account.",
      },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: admin.id } });
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const currentOk = await compare(currentPassword.trim(), user.passwordHash);
  if (!currentOk) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await hash(newPassword.trim(), 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true });
}
