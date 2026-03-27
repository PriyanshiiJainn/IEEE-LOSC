import Link from "next/link";

export default function LinksPage() {
  const links = [
    {
      title: "Start a chapter",
      url: "https://www.optica.org/get_involved/students/student_chapters/start_a_chapter/"
    },
    {
      title: "Chapter benefits",
      url: "https://www.optica.org/get_involved/students/student_chapters/student_chapter_benefits/"
    },
    {
      title: "Manage your chapter and Annual Reports",
      url: "https://www.optica.org/get_involved/students/student_chapters/manage_a_chapter/"
    },
    {
      title: "Chapter toolkit",
      url: "https://www.optica.org/get_involved/students/chapter_toolkit/"
    },
    {
      title: "Student chapter map",
      url: "https://www.optica.org/get_involved/students/student_chapters/student_chapter_map/"
    },
    {
      title: "Requesting Funding",
      url: "https://www.optica.org/get_involved/students/requesting_funding/"
    },
    {
      title: "Travelling lecturer",
      url: "https://www.optica.org/get_involved/students/traveling_lecturer/"
    },
    {
      title: "Optica membership",
      url: "https://www.optica.org/membership/join/individual/"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-heading text-ieee-navy text-center mb-8">Important Links</h1>

      <div className="space-y-4">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            className="group flex items-center justify-between p-4 border rounded-lg bg-white transition-shadow cursor-pointer hover:shadow-lg"
          >
            <span className="text-blue-600 text-lg group-hover:underline">
              {link.title}
            </span>
            <span className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-ieee-navy text-ieee-navy transform transition-transform duration-300 group-hover:rotate-45">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M8 7H17V16" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
