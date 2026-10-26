import { z } from "zod";

/**
 * Validation shared by the contact-people create and update routes.
 *
 * Every field but the name is optional: a contact with only a phone number is
 * a perfectly good entry, and the page simply leaves out whatever is missing.
 * Blank strings become null so nothing ever renders as an empty line.
 */
const optionalText = z
  .string()
  .trim()
  .max(191)
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

/** Email is checked only when one was actually typed. */
const optionalEmail = z
  .string()
  .trim()
  .max(191)
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional()
  .refine((v) => v == null || z.string().email().safeParse(v).success, {
    message: "Enter a valid email address",
  });

export const contactPersonSchema = z.object({
  name: z.string().trim().min(1).max(191),
  designation: optionalText,
  email: optionalEmail,
  phone: optionalText,
  order: z.number().int().optional(),
});

export type ContactPersonInput = z.infer<typeof contactPersonSchema>;

export type ContactPersonData = {
  name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  order: number;
};

/** Turn validated input into the columns stored for a contact. */
export function toContactPersonData(parsed: ContactPersonInput): ContactPersonData {
  return {
    name: parsed.name,
    designation: parsed.designation ?? null,
    email: parsed.email ?? null,
    phone: parsed.phone ?? null,
    order: typeof parsed.order === "number" ? parsed.order : 0,
  };
}
