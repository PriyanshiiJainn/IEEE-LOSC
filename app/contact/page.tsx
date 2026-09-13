import { getContactPeople } from "@/lib/data";
import { ContactInfo, type ContactEntry } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  // The contact list comes from Contact people in the admin portal and nowhere
  // else. It is deliberately unrelated to the team roster: adding a team member
  // never adds a contact, and removing one never takes a contact away.
  const people = await getContactPeople();

  const entries: ContactEntry[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    designation: p.designation,
    email: p.email,
    phone: p.phone,
  }));

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-2">Contact Us</h1>
      <p className="text-gray-800 mb-6 mt-8 mx-5">
        Reach out to our team or send a message.
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-ieee-navy mb-4">
            Contact information
          </h2>
          <ContactInfo people={entries} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-ieee-red mb-4">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
