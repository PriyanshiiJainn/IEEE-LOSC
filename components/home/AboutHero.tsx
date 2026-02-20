export function AboutHero() {
  return (
    <section
      className="bg-ieee-navy text-white py-16 md:py-24"
      style={{
        backgroundImage: "url('/lnm_campus.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1
          className="text-7xl md:text-7xl text-[#00CED1] font-bold mt-20 mb-20 font-times"
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          LNMMIIT OPTICA STUDENT CHAPTER
        </h1>
        <p
          className="text-3xl text-[#00CED1] max-w-3xl mx-auto font-georgia"
          style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
        >
        The LNM Institute of Information Technology, Jaipur (INDIA)
        </p>
      </div>
    </section>
  );
}

