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

/** Sub-roles under Functional Team (used for grouping / labels). */
export const FUNCTIONAL_ROLES = [
  "Web Development",
  "Content",
  "Event Management",
] as const;
