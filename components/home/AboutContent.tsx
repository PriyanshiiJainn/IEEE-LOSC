import { MarkdownContent } from "@/components/shared/MarkdownContent";

type AboutContentProps = {
  content?: {
    aboutUs?: string;
    aboutPoints?: string[];
    aboutOptica?: string;
    recentUpdates?: string[] | string;
  };
};

export function AboutContent({ content }: AboutContentProps) {

  const aboutUs = content?.aboutUs ?? "";
  const aboutPoints = content?.aboutPoints ?? [];
  const aboutOptica = content?.aboutOptica ?? "";

  const recentUpdatesRaw = content?.recentUpdates;
  const recentUpdates =
    typeof recentUpdatesRaw === "string"
      ? recentUpdatesRaw
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : recentUpdatesRaw ?? [
          "We are pleased to inform you about the inaugural event of the LNMIIT Optica Student Chapter LOSC at The LNM Institute of Information Technology, Jaipur.",
          "Event date: 12th March 2026 (10:00 AM; Thursday)",
          "Venue: LT-17, RIEP Building.",
        ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* ABOUT US */}
        <div>
          <h2 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold text-ieee-navy mb-4">
            About Us
          </h2>

          <div className="text-gray-800">
            <MarkdownContent>{aboutUs}</MarkdownContent>
          </div>

          {aboutPoints.length > 0 && (
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-800">
              {aboutPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ABOUT OPTICA */}
        <div>
          <h2 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold text-ieee-navy mb-4">
            About Optica
          </h2>
          <div className="text-gray-800">
            <MarkdownContent>{aboutOptica}</MarkdownContent>
          </div>
        </div>

        {/* RECENT UPDATES */}
        <div>
          <h2 className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold text-ieee-navy mb-4">
            Recent Updates
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            {recentUpdates.map((update, idx) => (
              <li key={idx}>{update}</li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
