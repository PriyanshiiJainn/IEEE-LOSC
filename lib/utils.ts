import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export const EVENT_CATEGORIES = [
  { value: "WORKSHOP", label: "Workshop" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "QUIZ", label: "Quiz" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "INVITED_TALK", label: "Invited Talk" },
] as const;

export const TEAM_CLASSIFICATIONS = [
  { value: "FACULTY_ADVISOR", label: "Faculty Advisor" },
  { value: "CORE", label: "Core Team" },
  { value: "FUNCTIONAL", label: "Functional Team" },
] as const;

// --- Academic years (e.g. "2026-27") ---

/** The academic year rolls over in July (0-indexed month 6). */
const ACADEMIC_YEAR_START_MONTH = 6;

/** Shape an academic year label must have: four digits, a dash, two digits. */
export const ACADEMIC_YEAR_PATTERN = /^\d{4}-\d{2}$/;

/** 2026 -> "2026-27" */
export function formatAcademicYear(startYear: number): string {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

/** "2026-27" -> 2026 (0 when unparseable, so such values sort last). */
export function academicYearStart(year: string): number {
  const parsed = Number.parseInt(year.slice(0, 4), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** True for a well-formed, consecutive label such as "2026-27". */
export function isValidAcademicYear(year: string): boolean {
  if (!ACADEMIC_YEAR_PATTERN.test(year)) return false;
  return year === formatAcademicYear(academicYearStart(year));
}

/** The academic year we are currently in. */
export function currentAcademicYear(now: Date = new Date()): string {
  const startYear =
    now.getMonth() >= ACADEMIC_YEAR_START_MONTH ? now.getFullYear() : now.getFullYear() - 1;
  return formatAcademicYear(startYear);
}

/** Newest year first — the order every year list uses. */
export function sortAcademicYearsDesc(years: string[]): string[] {
  return [...years].sort((a, b) => academicYearStart(b) - academicYearStart(a));
}

/** The year to suggest when adding one: the one after the newest year so far. */
export function nextAcademicYear(existing: string[], now: Date = new Date()): string {
  const latest = Math.max(
    academicYearStart(currentAcademicYear(now)) - 1,
    ...existing.map(academicYearStart),
  );
  return formatAcademicYear(latest + 1);
}
