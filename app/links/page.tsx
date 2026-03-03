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
      <h1 className="text-[5vw] font-heading text-ieee-navy text-center mb-8">Important Links</h1>

      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition">
            <Link
              href={link.url}
              target="_blank"
              className="text-blue-600 hover:underline text-lg"
            >
              {link.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
