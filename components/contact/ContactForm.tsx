"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
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
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ieee-red focus:outline-none focus:ring-1 focus:ring-ieee-red"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded bg-ieee-red px-4 py-2 text-sm font-medium text-white hover:bg-ieee-red/90 disabled:opacity-50 transition"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "done" && (
        <p className="text-sm text-green-600">Message sent. We’ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">
          Could not send. Database not configured yet — try again after setup.
        </p>
      )}
    </form>
  );
}
