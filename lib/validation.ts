import { z } from "zod";

/** RFC-style email (Zod built-in). For stricter regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

/** Phone: optional +, then 10–20 digits/spaces/dashes. At least 10 digits. */
const PHONE_REGEX = /^[+]?[\d\s\-]{10,20}$/;
const phoneMinDigits = (s: string) => (s.match(/\d/g)?.length ?? 0) >= 10;

export const phoneSchema = z
  .string()
  .min(1, "Phone is required")
  .max(20)
  .regex(PHONE_REGEX, "Enter a valid phone number (10–20 digits)")
  .refine(phoneMinDigits, "Phone must contain at least 10 digits");

export const eventRegistrationSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  name: z.string().min(1, "Name is required").max(200),
  rollNo: z.string().min(1, "Roll number is required").max(50),
  email: emailSchema,
  phone: phoneSchema,
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: emailSchema,
  subject: z.string().max(300).optional(),
  message: z.string().min(1, "Message is required").max(5000),
});
