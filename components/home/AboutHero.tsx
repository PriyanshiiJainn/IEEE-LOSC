export function AboutHero() {
  return (
    <section className="bg-ieee-navy text-white py-16 md:py-24" style={{ backgroundImage: "url('/LNMIIT.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-4xl font-bold mb-4 font-times">
          Optica Student Chapter
        </h1>
        <p className="text-lg text-white-300 max-w-2xl mx-auto font-times">
          The LNM Institute of Information Technology, Jaipur
        </p>
      </div>
    </section>
  );
}
