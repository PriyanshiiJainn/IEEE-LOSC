/**
 * Data layer: all data served from MySQL database.
 * Manage content via the admin portal at /admin.
 */

import { prisma } from "./prisma";

type EventWithOptionalRegistrationStatus = EventItem & {
  registrationStatus?: string;
};

type PrismaWithExtendedModels = typeof prisma & {
  recentActivity: {
    findMany: (args: { orderBy: { publishedAt: "asc" | "desc" } }) => Promise<RecentActivityItem[]>;
  };
  recentActivityIntro: {
    findFirst: () => Promise<{ id: string; content: string } | null>;
  };
  galleryImage: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<GalleryImageItem[]>;
  };
};

// --- Types ---

export type TeamMemberItem = {
  id: string;
  name: string;
  classification: string;
  post: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  order: number;
};

export type FlashItem = {
  id: string;
  title: string;
  shortMessage: string | null;
  link: string | null;
  event: { id: string } | null;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string | null;
  venue: string | null;
  category: string;
  brochureUrl: string | null;
  isFeatured: boolean;
  registrationClosed: boolean;
  registrationStatus: string;
};

export type EventReportItem = {
  id: string;
  eventId: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  publishedAt: Date | null;
  event: { id: string; title: string };
};

export type RecentActivityItem = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | null;
};

export type GalleryImageItem = {
  id: string;
  imageUrl: string;
  caption: string;
  order: number;
};

// --- Getters ---

export async function getAboutContent() {
  return await prisma.aboutContent.findFirst();
}

export async function getActiveFlash(): Promise<FlashItem | null> {
  return await prisma.flashAnnouncement.findFirst({
    where: { active: true },
    include: { event: { select: { id: true } } },
  });
}

export async function getFooterLinks(): Promise<{ label: string; url: string }[]> {
  const rows = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
  return rows.map((l) => ({ label: l.label, url: l.url }));
}

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  return await prisma.teamMember.findMany({
    orderBy: [{ classification: "asc" }, { order: "asc" }],
  });
}

export async function getEvents(): Promise<EventItem[]> {
  const rows = await prisma.event.findMany({ orderBy: { date: "desc" } });
  return rows.map((e) => ({
    ...e,
    registrationStatus: (e as EventWithOptionalRegistrationStatus).registrationStatus ?? "OPEN",
  }));
}

export async function getEventReports(): Promise<EventReportItem[]> {
  const rows = await prisma.eventReport.findMany({
    include: { event: { select: { id: true, title: true } } },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((r) => ({ ...r, event: r.event }));
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const row = await prisma.event.findUnique({ where: { id } });
  if (!row) return null;
  return {
    ...row,
    registrationStatus: (row as EventWithOptionalRegistrationStatus).registrationStatus ?? "OPEN",
  };
}

export async function getRecentActivities(): Promise<RecentActivityItem[]> {
  const db = prisma as PrismaWithExtendedModels;
  return await db.recentActivity.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRecentActivityIntro() {
  const db = prisma as PrismaWithExtendedModels;
  return await db.recentActivityIntro.findFirst();
}

export async function getGalleryImages(): Promise<GalleryImageItem[]> {
  const db = prisma as PrismaWithExtendedModels;
  const rows = await db.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows;
}
