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
  { value: "CORE", label: "Core Member" },
  { value: "FUNCTIONAL", label: "Functional Member" },
] as const;
