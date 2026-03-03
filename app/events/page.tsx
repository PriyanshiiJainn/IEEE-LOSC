import { getEvents } from "@/lib/data";
import { EventCard } from "@/components/events/EventCard";
import { EVENT_CATEGORIES } from "@/lib/utils";

export default async function EventsPage() {
  const events = await getEvents();

  // First two grids (your existing cards)
  const firstRow = events.slice(0, 3);
  const secondRow = events.slice(3, 6);

  // Filter events for new sections
  const invitedTalks = events.filter(
    (e) => e.category.toLowerCase() === "invited talks"
  );
  const webinars = events.filter(
    (e) => e.category.toLowerCase() === "webinars"
  );

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">

        {/* Main Page Heading */}
        <h1 className="text-[5vw] font-heading text-ieee-navy text-center mb-3">Events</h1>
        <p className="text-gray-800 mb-10 md:mb-12 leading-relaxed">
        We are the <span className="text-ieee-red">Optica Student Chapter</span> at <span className="text-ieee-red">The LNM Institute of Information Technology (LNMIIT)</span>, Jaipur, a vibrant community of students passionate about technology, innovation, and professional growth. Through workshops, hackathons, webinars, expert talks, and hands-on sessions, we foster curiosity, collaboration, and continuous learning. By promoting innovation, leadership, and teamwork, the <span className="text-ieee-red">LNMIIT Optica Student Chapter (LOSC) </span> strives to empower students to become skilled professionals and contributors to the global technological community.

        </p>
        {/* --- First Grid --- */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch mb-12 md:mb-14">
          {firstRow.map((event) => (
            <div key={event.id}>
              <h3 className="text-lg font-bold text-ieee-navy mb-3 px-4 sm:px-6 border-b pb-2">
                {event.category}
              </h3>
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* --- Second Grid --- */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch mb-12 md:mb-14">
          {secondRow.map((event) => (
            <div key={event.id}>
              <h3 className="text-lg font-semibold text-ieee-navy mb-3 px-4 sm:px-6 border-b pb-2">
                {event.category}
              </h3>
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* --- New Section: Invited Talks --- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Invited Talks</h2>
          {invitedTalks.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {invitedTalks.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-700">A series of Invited Talks will be organized featuring distinguished experts and industry professionals from diverse technical domains. These sessions will provide valuable insights into emerging technologies, research advancements, and real-world applications. It will offer students an opportunity to learn from experienced leaders and gain inspiration for their academic and professional journey.</p>
          )}
        </div>

        {/* --- New Section: Webinars --- */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Webinars</h2>
          {webinars.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {webinars.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-700">A series of Webinars will be organized to provide students with insights into emerging technologies and industry trends. These interactive online sessions will feature expert speakers who will share practical knowledge, real-world experiences, and career guidance. The webinars will offer a flexible platform for learning, discussion, and skill enhancement.</p>
          )}
        </div>

      </div>
    </section>
  );
}
