export function AboutHero() {
  return (
    <section
      className="bg-ieee-navy text-white py-16 md:py-24 flex items-center justify-center"
      style={{
        backgroundImage: "url('/centralplaza.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container h-[50vh] px-4 text-center flex flex-col justify-center items-center">
        <h1
          className="text-5xl text-border border-black  text-[#FFFFFF] font-bold font-times"
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}
        >
          LNMIIT OPTICA STUDENT CHAPTER
        </h1>

        <p
          className="text-2xl text-[#FFFFFF] max-w-3xl mx-auto font-times mt-6"
          style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
        >
          The LNM Institute of Information Technology, Jaipur (INDIA)
        </p>
      </div>
    </section>
  );
}