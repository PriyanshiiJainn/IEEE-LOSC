import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";

export const dynamic = "force-dynamic";

const HERO_TITLE = "Events";
const HERO_DESCRIPTION =
  "We are the Optica Student Chapter at The LNM Institute of Information Technology (LNMIIT), Jaipur, a vibrant community of students passionate about technology, innovation, and professional growth. Through workshops, hackathons, webinars, expert talks, and hands-on sessions, we foster curiosity, collaboration, and continuous learning.";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-6">
        {HERO_TITLE}
      </h1>

      <p className="max-w-3xl mx-auto text-gray-800 mb-12 leading-relaxed text-center">
        {HERO_DESCRIPTION}
      </p>

      {/* All events in one full-width column, category label above each card */}
      {events.length > 0 && (
        <div className="space-y-6 mb-16">
          {events.map((event) => (
            <div key={event.id}>
              <span className="inline-block text-sm font-semibold uppercase tracking-wide text-ieee-red mb-2">
                {event.category.replace(/_/g, " ")}
              </span>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
