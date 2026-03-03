import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";

export default async function EventsPage() {
  const events = await getEvents();

  const general = events.filter(
    (e) =>
      !["invited talks", "webinars"].includes(e.category.toLowerCase()),
  );
  const invitedTalks = events.filter(
    (e) => e.category.toLowerCase() === "invited talks",
  );
  const webinars = events.filter(
    (e) => e.category.toLowerCase() === "webinars",
  );

  return (
    <section className="container mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-6">
        Events
      </h1>

      <p className="max-w-3xl mx-auto text-gray-800 mb-12 leading-relaxed text-center">
        We are the <span className="text-ieee-red">Optica Student Chapter</span> at{" "}
        <span className="text-ieee-red">The LNM Institute of Information Technology (LNMIIT)</span>,
        Jaipur, a vibrant community of students passionate about technology, innovation, and
        professional growth. Through workshops, hackathons, webinars, expert talks, and hands-on
        sessions, we foster curiosity, collaboration, and continuous learning.
      </p>

      {general.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {general.map((event) => (
            <div key={event.id} className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-wide text-ieee-red mb-2">
                {event.category}
              </span>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-ieee-navy mb-8 border-b-2 border-ieee-red/30 pb-3">
          Invited Talks
        </h2>
        {invitedTalks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {invitedTalks.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">
            A series of Invited Talks will be organized featuring distinguished experts and
            industry professionals from diverse technical domains. These sessions will provide
            valuable insights into emerging technologies, research advancements, and real-world
            applications.
          </p>
        )}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-ieee-navy mb-8 border-b-2 border-ieee-red/30 pb-3">
          Webinars
        </h2>
        {webinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webinars.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed">
            A series of Webinars will be organized to provide students with insights into emerging
            technologies and industry trends. These interactive online sessions will feature expert
            speakers who will share practical knowledge, real-world experiences, and career guidance.
          </p>
        )}
      </div>
    </section>
  );
}
