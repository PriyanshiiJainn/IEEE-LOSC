import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";
import { EVENT_CATEGORIES } from "@/lib/utils";

export default async function EventsPage() {
  const events = await getEvents();

  const byCategory = EVENT_CATEGORIES.map(({ value, label }) => ({
    label,
    value,
    events: events.filter((e) => e.category === value),
  }));

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold text-ieee-navy mb-2">Events</h1>
      <p className="text-gray-600 mb-8">
        Workshops, hackathons, quizzes, webinars, and invited talks.
      </p>

      <div className="space-y-12">
        {byCategory.map((group) => (
          <div key={group.value}>
            <h2 className="text-xl font-semibold text-ieee-navy border-b border-gray-200 pb-2 mb-6">
              {group.label}
            </h2>
            {group.events.length === 0 ? (
              <p className="text-gray-500 text-sm">No events in this category yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
