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
      className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
    >
      {/* Two-column layout: text left, image right */}
      <div className="flex flex-col md:flex-row">

        {/* ── Left: content ── */}
        <div className="flex flex-col flex-1 p-6 md:p-8">
          {event.isFeatured && (
            <span className="text-xs font-medium text-ieee-red bg-ieee-red/10 px-2 py-0.5 rounded mb-3 self-start">
              Featured
            </span>
          )}

          <h3 className="text-xl font-bold text-ieee-navy leading-snug whitespace-pre-wrap break-words">
            {event.title}
          </h3>

          {/* Date + venue row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              {/* Calendar icon */}
              <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateStr}
              {event.time && <span className="text-gray-500">, {event.time}</span>}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1">
                {/* Location pin */}
                <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.venue}
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="my-4 border-gray-100" />

          {/* Description */}
          <div className="text-sm text-gray-800 leading-relaxed flex-1">
            <MarkdownContent>{event.description}</MarkdownContent>
          </div>

          {/* Action row */}
          <div className="mt-5 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
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
        </div>

        {/* ── Right: image (only shown if imageUrl exists) ── */}
        {event.imageUrl && (
          <div className="md:w-[42%] shrink-0 md:border-l border-t md:border-t-0 border-gray-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-56 md:h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
}
