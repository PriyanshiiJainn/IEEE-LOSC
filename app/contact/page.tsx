import { getTeamMembers } from "@/lib/data";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactPage() {
  const members = await getTeamMembers();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-2">Contact Us</h1>
      <p className="text-gray-800 mb-8">
        Reach out to our team or send a message.
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-ieee-navy mb-4">
            Team contact information
          </h2>
          <ContactInfo members={members} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ieee-navy mb-4">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
