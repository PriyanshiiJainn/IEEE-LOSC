type AboutContentProps = {
  content?: {
    aboutUs?: string;
    aboutPoints?: string[];
    aboutOptica?: string;
    recentUpdates?: string[];
  };
};

const highlightWords = [
  "The LNM Institute of Information Technology",
  "Material Science and Nano Electronics",
  "VLSI and Embedded System Design",
  "Centre for Quantum Computing, Communication, Sensing and Security",
  "Silicon Photonics Research Group",
  "LNMIIT",
  "Optica",
  "student chapter",
  "OSA",
  "LOSC",
  "advancing optics and Photonics",
  "12 March 2026",
  "Prof Muhammad Agus Hatta",
  "Dr Rikmantra Basu",
  "engaging quiz",
  "exciting prizes"
];

export function AboutContent({ content }: AboutContentProps) {

  const aboutUs = content?.aboutUs ?? "";
  const aboutPoints = content?.aboutPoints ?? [];
  const aboutOptica = content?.aboutOptica ?? "";

  const recentUpdates = content?.recentUpdates ?? [
    "The LNMIIT Optica Student Chapter (LOSC) will be inaugurated on 12 March 2026.",
    "The event will be graced by Prof Muhammad Agus Hatta and Dr Rikmantra Basu.",
    "An engaging quiz session will be conducted with exciting prizes for the winners."
  ];

  // 🔥 Highlight Function
  const renderHighlightedText = (text: string) => {
    const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      highlightWords.some(
        word => word.toLowerCase() === part.toLowerCase()
      ) ? (
        <span key={index} className="text-ieee-red font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* ABOUT US */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy mb-4 font-times">
            About Us
          </h2>

          <div className="text-gray-600 flex flex-col gap-4 font-georgia">
            {aboutUs.split("\n\n").map((para, idx) => (
              <p key={idx}>{renderHighlightedText(para)}</p>
            ))}
          </div>

          {aboutPoints.length > 0 && (
            <ul className="list-disc pl-6 mt-6 space-y-2 text-gray-600 font-georgia">
              {aboutPoints.map((point, idx) => (
                <li key={idx}>{renderHighlightedText(point)}</li>
              ))}
            </ul>
          )}
        </div>

        {/* ABOUT OPTICA */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy mb-4 font-times">
            About Optica
          </h2>
          <div className="text-gray-600 flex flex-col gap-4 font-georgia">
            {aboutOptica.split("\n\n").map((para, idx) => (
              <p key={idx}>{renderHighlightedText(para)}</p>
            ))}
          </div>
        </div>

        {/* RECENT UPDATES */}
        <div>
          <h2 className="text-3xl font-bold text-ieee-navy mb-4 font-times">
            Recent Updates
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 font-georgia">
            {recentUpdates.map((update, idx) => (
              <li key={idx}>{renderHighlightedText(update)}</li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
