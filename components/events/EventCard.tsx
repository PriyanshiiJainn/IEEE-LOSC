import Link from "next/link";
import type { EventItem } from "@/lib/data";

export function EventCard({ event }: { event: EventItem }) {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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
      <p className="text-sm text-gray-500 mt-1">{dateStr}</p>
      {event.time && <p className="text-sm text-gray-500">{event.time}</p>}
      {event.venue && <p className="text-sm text-gray-600 mt-1">{event.venue}</p>}
      <p className="text-sm text-gray-600 mt-2 ">{event.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {event.registrationClosed ? (
          <span className="inline-flex items-center rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600">
            Registration closed
          </span>
        ) : (
          <Link
            href={`/events/${event.id}/register`}
            className="mb-5 inline-flex items-center rounded bg-ieee-red px-4 py-2.5 text-xl font-medium text-white hover:bg-ieee-red/90 transition"
          >
            Register Now
          </Link>
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
