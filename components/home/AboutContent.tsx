type AboutContentProps = {
  content?: { aboutUs?: string; aboutOptica?: string };
};

// Default text
const defaultAboutUs = `
We are the IEEE Student Chapter at The LNM Institute of Information Technology (LNMIIT), Jaipur, a vibrant community of students passionate about technology, innovation, and professional growth.

Through workshops, hackathons, webinars, expert talks, and hands-on sessions, we foster curiosity, collaboration, and continuous learning.

By promoting innovation, leadership, and teamwork, the IEEE Student Chapter at LNMIIT strives to empower students to become skilled professionals and contributors to the global technological community.
`.trim();

const defaultAboutOptica = `
Optica (formerly OSA), Advancing Optics and Photonics Worldwide, is the society dedicated to promoting the generation, application, archiving and dissemination of knowledge in the field. Our chapter collaborates with Optica to promote research and technologies in light-based sciences.
`.trim();

// Highlight words
const highlights = [
  "Optica Student Chapter",
  "The LNM Institute of Information Technology",
  "Optica",
  "Photonics",
  "Light-based",
  "OSA",
  "LNMIIT"
];

export function AboutContent({ content }: AboutContentProps) {
  const aboutUs = content?.aboutUs ?? defaultAboutUs;
  const aboutOptica = content?.aboutOptica ?? defaultAboutOptica;

  // Highlight words
  const renderHighlighted = (text: string) => {
    const parts = text.split(new RegExp(`(${highlights.join("|")})`, "gi"));
    return parts.map((part, i) =>
      highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="text-ieee-red font-semibold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-12 ">
        {/* About Us */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy mb-4 font-times">About Us</h2>
          <div className="text-gray-600 flex flex-col gap-4 font-georgia">
            {aboutUs.split("\n\n").map((para, idx) => (
              <p key={idx}>{renderHighlighted(para)}</p>
            ))}
          </div>
        </div>

        {/* About Optica */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy font-times mb-4">About Optica</h2>
          <div className="text-gray-600 font-georgia">
            {aboutOptica.split("\n\n").map((para, idx) => (
              <p key={idx}>{renderHighlighted(para)}</p>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy font-times mb-4">Recent Updates</h2>
          <div className="text-gray-600 font-georgia">
            {aboutOptica.split("\n\n").map((para, idx) => (
              <p key={idx}>{renderHighlighted(para)}</p>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
