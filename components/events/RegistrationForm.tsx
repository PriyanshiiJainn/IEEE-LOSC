"use client";

import { useState } from "react";
import Link from "next/link";

export function RegistrationForm({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: data.get("name"),
          rollNo: data.get("rollNo"),
          email: data.get("email"),
          phone: data.get("phone"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-medium text-green-800">Registration submitted.</p>
        <p className="text-sm text-green-700 mt-1">You’re registered for {eventTitle}.</p>
        <Link
          href="/events"
          className="mt-4 inline-block text-sm font-medium text-ieee-red hover:underline"
        >
          Back to events
        </Link>
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
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded bg-ieee-red px-4 py-2 font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50 transition"
      >
        {status === "sending" ? "Submitting…" : "Submit registration"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Could not submit. Database not configured yet — try again after setup.
        </p>
      )}
    </form>
  );
}
