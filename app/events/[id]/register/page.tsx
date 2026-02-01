import Link from "next/link";
import { getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import { RegistrationForm } from "@/components/events/RegistrationForm";

type Props = { params: Promise<{ id: string }> };

export default async function EventRegisterPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 max-w-lg">
      <Link href="/events" className="text-sm text-ieee-red hover:underline mb-6 inline-block">
        Back to events
      </Link>
      <h1 className="text-2xl font-bold text-ieee-navy mb-2">Register for {event.title}</h1>
      <p className="text-gray-600 mb-6">
        {new Date(event.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        {event.venue && ` · ${event.venue}`}
      </p>
      <RegistrationForm eventId={event.id} eventTitle={event.title} />
    </section>
  );
}
