/**
 * Data layer: tries DB first, falls back to mock data when no MySQL.
 * Set USE_MOCK_DATA=true in .env to skip DB entirely (fast, no connection errors).
 * Database: PostgreSQL (see DATABASE-SWITCH.md to use MySQL).
 */

import { prisma } from "./prisma";

const USE_MOCK = process.env.USE_MOCK_DATA === "true";

// --- Mock data (used when DB is not configured) ---
const FUNCTIONAL_TEAMS = [
  {
    name: "Web Development",
    keywords: ["web"],
  },
  {
    name: "Content Creation",
    keywords: ["content"],
  },
  {
    name: "Event Management",
    keywords: ["event"],
  },
] as const;

const MOCK_ABOUT = {
  id: "mock",

  // Paragraph content (NO BULLETS)
  aboutUs: `
The LNM Institute of Information Technology (LNMIIT), Jaipur, presently provides a range of optics and photonics programs.

➤ The Physics Department at LNMIIT clearly identifies optics as one of its research interests, along with cosmology, high-energy physics, material science, photovoltaics, biosensors, and nanotechnology.

➤ LNMIIT has three specialized research centres — Centre for Material Science and Nano Electronics, Centre for VLSI and Embedded System Design (C-VESD), and Centre for Quantum Computing, Communication, Sensing and Security.

➤ LNMIIT has a specialized Silicon Photonics Research Group within the ECE Department. Their study domains encompass:
`.trim(),

  // ONLY bullet items here (if needed)
  aboutPoints: [
    "Integrated Photonics (design to fabrication)",
    "Heterogeneous integration of Group-IV materials",
    "Fiber-optic telecommunications and data communications",
    "Photonic sensors (biological, chemical, gas)",
    "Devices operating in NIR, MIR and THz bands"
  ],

  aboutOptica: `
Optica, formerly known as OSA, is a leading organization dedicated to advancing optics and photonics worldwide, promoting knowledge generation, application, and dissemination in the field.
`.trim(),

  updatedAt: new Date(),
};

const MOCK_FLASH = null; // no banner when no DB

const MOCK_FOOTER_LINKS = [
  { label: "IEEE", url: "https://www.ieee.org/" },
  { label: "LNMIIT", url: "https://www.lnmiit.ac.in/" },
  { label: "ASME", url: "https://asme.lnmiit.ac.in/" },
  { label: "ACM", url: "https://lnmiit.acm.org/" },
];

const MOCK_TEAM = [
  { id: "1", name: "Dr. Harshvardhan Kumar", classification: "FACULTY_ADVISOR", post: "Advisor of LOSC, Assistant Professor, ECE & Head of Silicon Photonics Research Group, LNMIIT", imageUrl: "/faculty_advisor.jpeg", email: "harshvardhan.kumar@lnmiit.ac.in ", phone: "+917276373776", linkedin: null, order: 0 },
  { id: "2", name: "Neha Soni", classification: "CORE", post: "President",imageUrl: "/President.jpeg", email: "21dec008@lnmiit.ac.in", phone: "+917665125804", linkedin: null, order: 1 },
  { id: "3", name: "Yash Bijawat", classification: "CORE", post: "Vice President", imageUrl: "/Vice_President.jpeg", email: "22uec146@lnmiit.ac.in", phone:  "+917597309945", linkedin: null, order: 2 },
  { id: "4", name: "Sonali Rana", classification: "CORE", post: "Secretary", imageUrl: "/Secretary.jpeg", email: "25mec003@lnmiit.ac.in", phone: "+919418240014", linkedin: null, order: 3 },
  { id: "5", name: "Som Mudgil", classification: "CORE", post: "Treasurer", imageUrl: "/treasurer.jpeg", email: "22uec133@lnmiit.ac.in", phone: " +918957858317", linkedin: null, order: 4 },
  { id: "6", name: "Jyoti Tater", classification: "CORE", post: "Officer", imageUrl: "/officer.jpeg", email: "22uec059@lnmiit.ac.in", phone: "+917073781288", linkedin: null, order: 5 },
  { id: "7", name: "Priyanshi Jain", classification: "FUNCTIONAL", post: "Web Development (Lead) ", imageUrl: "/WebdLead.jpeg", email: "24uec249@lnmiit.ac.in", phone: "+919119147959", linkedin: null, order: 6 },
  { id: "8", name: "Vanshita Chotwani", classification: "FUNCTIONAL", post: "Web Development (Member) ", imageUrl: "/WebdMember.jpeg", email:"24uec222@lnmiit.ac.in" , phone:"+919782801181" , linkedin:null , order :7 },
  { id: "9", name: "Nandini Sharma", classification: "FUNCTIONAL", post: "Content Creation (Lead)", imageUrl: "/ContentLead.jpeg", email: "24dec034@lnmiit.ac.in", phone: "+918822796132", linkedin: null, order: 8 },
  { id: "8", name: "Vanshita Chotwani", classification: "FUNCTIONAL", post: "Content Creation (Member) ", imageUrl: "/WebdMember.jpeg", email:"24uec222@lnmiit.ac.in" , phone:"+919782801181" , linkedin:null , order :7 },
  { id: "10", name: "Riddhima Agarwal", classification: "FUNCTIONAL", post: "Event Management (Lead)", imageUrl: "/EventLead.jpeg", email: "24uec076@lnmiit.ac.in", phone: "+916377284431", linkedin: null, order: 9 },
  { id: "11", name: "Amrit Mishra", classification: "FUNCTIONAL", post: "Event Management (Member)", imageUrl: "/EventMember.jpeg", email:"24dec051@lnmiit.ac.in" , phone:"+917217427440" , linkedin:null , order :10 },
];

const MOCK_EVENTS = [
  { id: "e1", title: "Annual Workshop 2025", description: "An Annual Workshop will be organized to provide hands-on learning in emerging technologies. The session will offer expert guidance and practical exposure to enhance students’ technical skills.", date: new Date("2025-03-15"), time: "10:00 AM", venue: "LNMIIT Campus", category: "WORKSHOP", brochureUrl: null, isFeatured: true, registrationClosed: false },
  { id: "e2", title: "IEEE Hackathon", description: "A 24-hour innovation challenge where students collaborate to build real-world tech solutions from scratch. Guided by mentors, teams design, develop, and pitch impactful prototypes in a fast-paced environment.", date: new Date("2025-04-20"), time: "9:00 AM", venue: "Lab Block", category: "HACKATHON", brochureUrl: null, isFeatured: true, registrationClosed: false },
  { id: "e3", title: "Tech Quiz", description: "An exciting Tech Quiz will be organized to test students’ knowledge in technology and emerging trends, challenging their technical awareness and quick-thinking skills.", date: new Date("2025-05-10"), time: "2:00 PM", venue: "Seminar Hall", category: "QUIZ", brochureUrl: null, isFeatured: true, registrationClosed: false },
  
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
  registrationClosed: boolean;
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
