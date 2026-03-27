import Link from "next/link";
import type { EventItem } from "@/lib/data";
import { MarkdownContent } from "@/components/shared/MarkdownContent";

export function EventCard({ event }: { event: EventItem }) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const status = (event.registrationStatus ?? "").toUpperCase() as
    | "OPEN"
    | "SOON"
    | "CLOSED"
    | "";

  const effectiveStatus: "OPEN" | "SOON" | "CLOSED" =
    status === "OPEN" || status === "SOON" || status === "CLOSED"
      ? status
      : event.registrationClosed
        ? "CLOSED"
        : "OPEN";

  const statusLabel =
    effectiveStatus === "OPEN"
      ? "Registration open"
      : effectiveStatus === "SOON"
        ? "Registration soon"
        : "Registration closed";

  const isOpen = effectiveStatus === "OPEN";

  const statusClasses =
    effectiveStatus === "OPEN"
      ? "text-ieee-red bg-ieee-red/10 border-ieee-red"
      : "text-gray-700 bg-gray-100 border-gray-300";

  return (
    <article
      id={`event-${event.id}`}
      className="h-full flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition"
    >
      {event.isFeatured && (
        <span className="text-xs font-medium text-ieee-red bg-ieee-red/10 px-2 py-0.5 rounded mb-2 self-start">
          Featured
        </span>
      )}
      <h3 className="font-semibold text-ieee-navy">{event.title}</h3>
      <p className="text-sm text-gray-700 mt-1">{dateStr}</p>
      {event.time && <p className="text-sm text-gray-700">{event.time}</p>}
      {event.venue && <p className="text-sm text-gray-800 mt-1">{event.venue}</p>}
      <div className="text-sm text-gray-800 mt-2 flex-1">
        <MarkdownContent>{event.description}</MarkdownContent>
      </div>
      <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
        <span
          className={
            "inline-flex items-center rounded border px-3 py-1.5 text-sm font-medium " +
            statusClasses
          }
        >
          {statusLabel}
        </span>
        {isOpen ? (
          <Link
            href={`/events/${event.id}/register`}
            className="ml-auto inline-flex items-center rounded bg-ieee-red px-4 py-2.5 text-sm font-medium text-white hover:bg-ieee-red/90 transition"
          >
            Register now
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="ml-auto inline-flex items-center rounded bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 cursor-not-allowed"
          >
            Register
          </button>
        )}
        {event.brochureUrl && (
          <a
            href={event.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Brochure
          </a>
        )}
      </div>
    </article>
  );
}
