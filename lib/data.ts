/**
 * Data layer: tries DB first, falls back to mock data when no MySQL.
 * Set USE_MOCK_DATA=true in .env to skip DB entirely (fast, no connection errors).
 */

import { prisma } from "./prisma";

const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// --- Mock data (used when DB is not configured) ---

const MOCK_ABOUT = {
  id: "mock",
  aboutUs:
    "We are the IEEE Student Chapter at The LNM Institute of Information Technology (LNMIIT), Jaipur. Our chapter fosters technical learning, innovation, and industry engagement through workshops, hackathons, webinars, and invited talks.",
  aboutOptica:
    "Optica (formerly OSA) is a leading society in optics and photonics. Our chapter collaborates with Optica to promote light-based technologies and research among students.",
  updatedAt: new Date(),
};

const MOCK_FLASH = null; // no banner when no DB

const MOCK_FOOTER_LINKS = [
  { label: "IEEE", url: "https://www.ieee.org/" },
  { label: "LNMIIT", url: "https://www.lnmiit.ac.in/" },
  { label: "Optica", url: "https://www.optica.org/" },
];

const MOCK_TEAM = [
  { id: "1", name: "Dr. Faculty Advisor", classification: "FACULTY_ADVISOR", post: "Faculty Advisor", imageUrl: null, email: "advisor@lnmiit.ac.in", phone: null, linkedin: null, order: 0 },
  { id: "2", name: "Student Chair", classification: "CORE", post: "Chair", imageUrl: null, email: "chair@lnmiit.ac.in", phone: null, linkedin: null, order: 1 },
  { id: "3", name: "Student Vice Chair", classification: "CORE", post: "Vice Chair", imageUrl: null, email: "vicechair@lnmiit.ac.in", phone: null, linkedin: null, order: 2 },
  { id: "4", name: "Member One", classification: "FUNCTIONAL", post: "Member", imageUrl: null, email: "member1@lnmiit.ac.in", phone: null, linkedin: null, order: 3 },
];

const MOCK_EVENTS = [
  { id: "e1", title: "Annual Workshop 2025", description: "Hands-on workshop on emerging technologies.", date: new Date("2025-03-15"), time: "10:00 AM", venue: "LNMIIT Campus", category: "WORKSHOP", brochureUrl: null, isFeatured: true },
  { id: "e2", title: "IEEE Hackathon", description: "24-hour hackathon for students.", date: new Date("2025-04-20"), time: "9:00 AM", venue: "Lab Block", category: "HACKATHON", brochureUrl: null, isFeatured: false },
  { id: "e3", title: "Tech Quiz", description: "Technical quiz competition.", date: new Date("2025-05-10"), time: "2:00 PM", venue: "Seminar Hall", category: "QUIZ", brochureUrl: null, isFeatured: false },
];

const MOCK_REPORTS = [
  { id: "r1", eventId: "e1", title: "Annual Workshop 2024 Report", content: "Summary and highlights from the workshop.", coverImageUrl: null, publishedAt: new Date("2024-04-01"), event: { id: "e1", title: "Annual Workshop 2024" } },
];

// --- Getters (DB with fallback) ---

export async function getAboutContent() {
  if (USE_MOCK) return MOCK_ABOUT;
  try {
    const row = await prisma.aboutContent.findFirst();
    return row ?? MOCK_ABOUT;
  } catch {
    return MOCK_ABOUT;
  }
}

export type FlashItem = {
  id: string;
  title: string;
  shortMessage: string | null;
  link: string | null;
  event: { id: string } | null;
};

export async function getActiveFlash(): Promise<FlashItem | null> {
  if (USE_MOCK) return MOCK_FLASH;
  try {
    const row = await prisma.flashAnnouncement.findFirst({
      where: { active: true },
      include: { event: { select: { id: true } } },
    });
    return row;
  } catch {
    return MOCK_FLASH;
  }
}

export async function getFooterLinks(): Promise<{ label: string; url: string }[]> {
  if (USE_MOCK) return MOCK_FOOTER_LINKS;
  try {
    const rows = await prisma.footerLink.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) return rows.map((l) => ({ label: l.label, url: l.url }));
    return MOCK_FOOTER_LINKS;
  } catch {
    return MOCK_FOOTER_LINKS;
  }
}

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

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  if (USE_MOCK) return MOCK_TEAM;
  try {
    const rows = await prisma.teamMember.findMany({ orderBy: [{ classification: "asc" }, { order: "asc" }] });
    if (rows.length > 0) return rows;
    return MOCK_TEAM;
  } catch {
    return MOCK_TEAM;
  }
}

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
};

export async function getEvents(): Promise<EventItem[]> {
  if (USE_MOCK) return MOCK_EVENTS;
  try {
    const rows = await prisma.event.findMany({ orderBy: { date: "desc" } });
    if (rows.length > 0) return rows;
    return MOCK_EVENTS;
  } catch {
    return MOCK_EVENTS;
  }
}

export type EventReportItem = {
  id: string;
  eventId: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  event: { id: string; title: string };
};

export async function getEventReports(): Promise<EventReportItem[]> {
  if (USE_MOCK) return MOCK_REPORTS;
  try {
    const rows = await prisma.eventReport.findMany({
      include: { event: { select: { id: true, title: true } } },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) return rows.map((r) => ({ ...r, event: r.event }));
    return MOCK_REPORTS;
  } catch {
    return MOCK_REPORTS;
  }
}

export async function getEventById(id: string): Promise<EventItem | null> {
  if (USE_MOCK) return MOCK_EVENTS.find((e) => e.id === id) ?? null;
  try {
    const row = await prisma.event.findUnique({ where: { id } });
    return row;
  } catch {
    return MOCK_EVENTS.find((e) => e.id === id) ?? null;
  }
}
