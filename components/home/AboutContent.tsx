type AboutContentProps = {
  content: { aboutUs: string; aboutOptica: string } | null;
};

const defaultAboutUs = `
We are the IEEE Student Chapter at The LNM Institute of Information Technology (LNMIIT), Jaipur.
Our chapter fosters technical learning, innovation, and industry engagement through workshops,
hackathons, webinars, and invited talks.
`.trim();

const defaultAboutOptica = `
Optica (formerly OSA) is a leading society in optics and photonics. Our chapter collaborates
with Optica to promote light-based technologies and research among students.
`.trim();

export function AboutContent({ content }: AboutContentProps) {
  const aboutUs = content?.aboutUs || defaultAboutUs;
  const aboutOptica = content?.aboutOptica || defaultAboutOptica;

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 className="text-2xl font-bold text-ieee-navy mb-4">About Us</h2>
          <p className="text-gray-600 whitespace-pre-line">{aboutUs}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ieee-navy mb-4">About Optica</h2>
          <p className="text-gray-600 whitespace-pre-line">{aboutOptica}</p>
        </div>
      </div>
    </section>
  );
}
