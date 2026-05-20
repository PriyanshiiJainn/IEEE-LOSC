import { z } from "zod";

/** Normalize stored media paths (relative /… or absolute https://…). */
export function normalizeMediaUrl(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const forward = trimmed.replace(/\\/g, "/");
  if (/^(https?:)?\/\//i.test(forward) || forward.startsWith("data:")) {
    return forward;
  }

  const publicIdx = forward.toLowerCase().lastIndexOf("/public/");
  if (publicIdx >= 0) {
    return forward.slice(publicIdx + "/public".length);
  }

  if (forward.toLowerCase().startsWith("public/")) {
    return `/${forward.slice("public/".length)}`;
  }

  if (!forward.startsWith("/")) {
    return `/${forward}`;
  }

  return forward;
}

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);

function isValidMediaUrl(value: string): boolean {
  if (value.includes("..")) return false;
  if (value.startsWith("/")) return value.length > 1;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Optional URL: absolute https?:// or site-relative path (/pdfs/…, /gallery/…). */
export const optionalMediaUrlSchema = z.preprocess(
  (v) => normalizeMediaUrl(emptyToNull(v)),
  z
    .string()
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || isValidMediaUrl(v), {
      message: "Must be a valid URL or path starting with /",
    }),
);
