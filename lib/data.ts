/**
 * Data layer: all data served from MySQL database.
 * Manage content via the admin portal at /admin.
 */

import { prisma } from "./prisma";
import { getDefaultGalleryDbRows } from "./gallery-defaults.js";
import { unstable_noStore as noStore } from "next/cache";
import { sortAcademicYearsDesc } from "./utils";

type EventWithOptionalRegistrationStatus = EventItem & {
  registrationStatus?: string;
};

type PrismaWithExtendedModels = typeof prisma & {
  recentActivity: {
    findMany: (args: {
      orderBy: { publishedAt: "asc" | "desc" };
      include?: { images?: boolean | { orderBy?: { order: "asc" | "desc" } } };
    }) => Promise<RecentActivityItem[]>;
  };
  recentActivityIntro: {
    findFirst: () => Promise<{ id: string; content: string } | null>;
  };
  galleryImage: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<GalleryImageItem[]>;
  };
  contactPerson: {
    findMany: (args: {
      orderBy: Array<{ order: "asc" | "desc" } | { createdAt: "asc" | "desc" }>;
    }) => Promise<ContactPersonItem[]>;
  };
  footerSettings: {
    findFirst: () => Promise<FooterSettingsItem | null>;
  };
};

// --- Types ---

export type TeamMemberItem = {
  id: string;
  name: string;
  classification: string;
  academicYear: string;
  category: string | null;
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
  imageUrl: string | null;
  isFeatured: boolean;
  registrationClosed: boolean;
  registrationStatus: string;
};

export type EventReportItem = {
  id: string;
  eventId: string | null;
  title: string;
  content: string;
  coverImageUrl: string | null;
  pdfUrl: string | null;
  isMom: boolean;
  publishedAt: Date | null;
  event: { id: string; title: string } | null;
};

export type RecentActivityImage = {
  id: string;
  imageUrl: string;
  order: number;
};

export type RecentActivityItem = {
  id: string;
  title: string;
  content: string;
  pdfUrl: string | null;
  publishedAt: Date | null;
  images: RecentActivityImage[];
};

export type NoticeItem = {
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

export type ContactPersonItem = {
  id: string;
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  order: number;
};

export type FooterSettingsItem = {
  copyrightText: string;
  linksHeading: string;
};

const DEFAULT_FOOTER_LINKS: { label: string; url: string }[] = [
  { label: "IEEE", url: "https://www.ieee.org/" },
  { label: "LNMIIT", url: "https://www.lnmiit.ac.in/" },
  { label: "ASME", url: "https://asme.lnmiit.ac.in/" },
  { label: "ACM", url: "https://lnmiit.acm.org/" },
];

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsItem = {
  copyrightText: "LNMIIT Optica Student Chapter © LNMIIT 2026",
  linksHeading: "Other links",
};

async function fromDb<T>(label: string, query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (err) {
    console.error(`[${label}] database error:`, err);
    return fallback;
  }
}

// --- Getters ---

export async function getAboutContent() {
  noStore();
  return fromDb("getAboutContent", () => prisma.aboutContent.findFirst(), null);
}

export async function getActiveFlash(): Promise<FlashItem | null> {
  noStore();
  return fromDb(
    "getActiveFlash",
    () =>
      prisma.flashAnnouncement.findFirst({
        where: { active: true },
        include: { event: { select: { id: true } } },
      }),
    null,
  );
}

export async function getFooterLinks(): Promise<{ label: string; url: string }[]> {
  noStore();
  return fromDb(
    "getFooterLinks",
    async () => {
      const rows = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
      return rows.map((l) => ({ label: l.label, url: l.url }));
    },
    DEFAULT_FOOTER_LINKS,
  );
}

/** Footer copyright line and the heading shown above the other links. */
export async function getFooterSettings(): Promise<FooterSettingsItem> {
  noStore();
  return fromDb(
    "getFooterSettings",
    async () => {
      const db = prisma as PrismaWithExtendedModels;
      const row = await db.footerSettings.findFirst();
      if (!row) return DEFAULT_FOOTER_SETTINGS;
      return {
        copyrightText: row.copyrightText || DEFAULT_FOOTER_SETTINGS.copyrightText,
        linksHeading: row.linksHeading ?? DEFAULT_FOOTER_SETTINGS.linksHeading,
      };
    },
    DEFAULT_FOOTER_SETTINGS,
  );
}

/**
 * Team members, optionally limited to one academic year (e.g. "2026-27").
 * Without a year, every year's members are returned.
 */
export async function getTeamMembers(academicYear?: string): Promise<TeamMemberItem[]> {
  noStore();
  return fromDb(
    "getTeamMembers",
    () =>
      prisma.teamMember.findMany({
        where: academicYear ? { academicYear } : undefined,
        orderBy: [{ classification: "asc" }, { order: "asc" }],
      }),
    [],
  );
}

/**
 * Academic years offered on the team page, newest first. Years are admin-managed,
 * so one appears here as soon as it is created — before it has any members. Years
 * found on members are included too, in case a row predates its year record.
 */
export async function getTeamAcademicYears(): Promise<string[]> {
  noStore();
  return fromDb(
    "getTeamAcademicYears",
    async () => {
      const [years, memberYears] = await Promise.all([
        prisma.academicYear.findMany({ select: { year: true } }),
        prisma.teamMember.findMany({
          distinct: ["academicYear"],
          select: { academicYear: true },
        }),
      ]);
      return sortAcademicYearsDesc([
        ...new Set([...years.map((y) => y.year), ...memberYears.map((m) => m.academicYear)]),
      ]);
    },
    [],
  );
}

export async function getEvents(): Promise<EventItem[]> {
  noStore();
  return fromDb(
    "getEvents",
    async () => {
      const rows = await prisma.event.findMany({ orderBy: { date: "desc" } });
      return rows.map((e) => ({
        ...e,
        registrationStatus: (e as EventWithOptionalRegistrationStatus).registrationStatus ?? "OPEN",
      }));
    },
    [],
  );
}

export async function getEventReports(): Promise<EventReportItem[]> {
  noStore();
  return fromDb(
    "getEventReports",
    async () => {
      const rows = await prisma.eventReport.findMany({
        include: { event: { select: { id: true, title: true } } },
        orderBy: { publishedAt: "desc" },
      });
      return rows.map((r) => ({ ...r, event: r.event ?? null }));
    },
    [],
  );
}

export async function getEventById(id: string): Promise<EventItem | null> {
  noStore();
  return fromDb(
    "getEventById",
    async () => {
      const row = await prisma.event.findUnique({ where: { id } });
      if (!row) return null;
      return {
        ...row,
        registrationStatus: (row as EventWithOptionalRegistrationStatus).registrationStatus ?? "OPEN",
      };
    },
    null,
  );
}

export async function getRecentActivities(): Promise<RecentActivityItem[]> {
  noStore();
  const db = prisma as PrismaWithExtendedModels;
  return fromDb(
    "getRecentActivities",
    () =>
      db.recentActivity.findMany({
        orderBy: { publishedAt: "desc" },
        include: { images: { orderBy: { order: "asc" } } },
      }),
    [],
  );
}

export async function getRecentActivityIntro() {
  noStore();
  const db = prisma as PrismaWithExtendedModels;
  return fromDb("getRecentActivityIntro", () => db.recentActivityIntro.findFirst(), null);
}

export async function getGalleryImages(): Promise<GalleryImageItem[]> {
  noStore();
  try {
    const db = prisma as PrismaWithExtendedModels;
    const rows = await db.galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (rows.length > 0) return rows;
    return getDefaultGalleryDbRows();
  } catch (err) {
    console.error("[getGalleryImages] database error, using bundled defaults:", err);
    return getDefaultGalleryDbRows();
  }
}

/** People an admin has listed on the contact page, in their chosen order. */
export async function getContactPeople(): Promise<ContactPersonItem[]> {
  noStore();
  return fromDb(
    "getContactPeople",
    () => {
      const db = prisma as PrismaWithExtendedModels;
      return db.contactPerson.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      });
    },
    [],
  );
}

export async function getNotices(): Promise<NoticeItem[]> {
  noStore();
  return fromDb(
    "getNotices",
    () => prisma.notice.findMany({ orderBy: { publishedAt: "desc" } }),
    [],
  );
}
