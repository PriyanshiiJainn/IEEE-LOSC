import { getEventReports } from "@/lib/data";
import { ReportCard } from "@/components/events/ReportCard";

export default async function EventReportsPage() {
  const reports = await getEventReports();

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h1 className="flex justify-center text-4xl font-bold text-ieee-navy mb-2">Recent Activities</h1>
      <p className="mt-5 text-gray-600 mb-8">
        The <span className="text-ieee-red">LNMIIT Optica Student Chapter (LOSC)</span> will be inaugurated on <span className="text-ieee-red">12 March 2026</span> in the presence of distinguished dignitaries and esteemed guests. The event will be graced by <span className="text-ieee-red">Prof. Muhammad Agus Hatta</span>, Vice Rector for Research, Innovation, Cooperation, and Alumni at Institut Teknologi Sepuluh Nopember (ITS), Indonesia, and <span className="text-ieee-red">Dr. Rikmantra Basu</span>, Associate Professor and Head of the Department of Electronics and Communication Engineering, NIT Delhi.

The program will feature insightful addresses by the chief guests, emphasizing the importance of research, innovation, and global collaboration in optics and photonics. An engaging quiz session will also be conducted, with exciting prizes awarded to the winners.
</p>
    </section>
  );
}

