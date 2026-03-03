"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-]{10,20}$/;
const phoneMinDigits = (s: string) => (s.match(/\d/g)?.length ?? 0) >= 10;

export function RegistrationForm({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => router.push("/events"), 2000);
    return () => clearTimeout(t);
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim() ?? "";
    const rollNo = (data.get("rollNo") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const phone = (data.get("phone") as string)?.trim() ?? "";

    setError("");
    setFieldErrors({});

    if (!name.length) {
      setFieldErrors((f) => ({ ...f, name: "Name is required" }));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setFieldErrors((f) => ({ ...f, email: "Enter a valid email address" }));
      return;
    }
    if (!PHONE_REGEX.test(phone) || !phoneMinDigits(phone)) {
      setFieldErrors((f) => ({ ...f, phone: "Enter a valid phone number (at least 10 digits)" }));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, rollNo, email, phone }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Registration failed");
        if (json.errors) setFieldErrors(json.errors);
        setStatus("error");
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setError("Could not submit. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">You are registered.</p>
        <p className="text-sm text-green-700 mt-1">Redirecting you back to events…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
        {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
      </div>
      <div>
        <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
          Roll number
        </label>
        <input
          id="rollNo"
          name="rollNo"
          type="text"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
        {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
        {fieldErrors.phone && <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded bg-ieee-red px-4 py-2 font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50 transition"
      >
        {status === "sending" ? "Submitting…" : "Submit registration"}
      </button>
      {status === "error" && error && (
        <div className="space-y-1">
          <p className="text-sm text-red-600">{error}</p>
          {(error.includes("Database") || error.includes("reachable") || error.includes("migrations")) && (
            <p className="text-xs text-gray-700">
              Ensure .env has DATABASE_URL set, you&apos;ve run <code className="bg-gray-100 px-1 rounded">npx prisma migrate dev</code>, and (for Neon) the project is resumed in the dashboard.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
