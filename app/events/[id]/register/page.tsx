export const dynamic = "force-dynamic";

import Link from "next/link";
import { getEventById } from "@/lib/data";
import { notFound } from "next/navigation";
import { RegistrationForm } from "@/components/events/RegistrationForm";

type Props = { params: Promise<{ id: string }> };

export default async function EventRegisterPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

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

  if (effectiveStatus !== "OPEN") {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-lg">
        <Link href="/events" className="text-sm text-ieee-red hover:underline mb-6 inline-block">
          Back to events
        </Link>
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-heading text-ieee-navy mb-2">{event.title}</h1>
        <p className="text-gray-800 mb-4">
          {new Date(event.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {event.venue && ` · ${event.venue}`}
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="font-medium text-amber-800">
            {effectiveStatus === "SOON"
              ? "Registration for this event will open soon."
              : "Registration for this event is closed."}
          </p>
          <p className="text-sm text-amber-700 mt-1">Check back for updates and future events.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 max-w-lg">
      <Link href="/events" className="text-sm text-ieee-red hover:underline mb-6 inline-block">
        Back to events
      </Link>
      <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-heading text-ieee-navy mb-2">Register for {event.title}</h1>
      <p className="text-gray-800 mb-6">
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
