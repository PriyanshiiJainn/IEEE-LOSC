export function AboutHero() {
  return (
    <section className="relative -mt-16 h-screen bg-cover bg-center bg-[url('/centralplaza.webp')]">
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-7xl font-heading drop-shadow-lg">
          LNMIIT OPTICA STUDENT CHAPTER
        </h1>

        <p className="text-3xl max-w-4xl mt-6 drop-shadow-md">
          The LNM Institute of Information Technology, Jaipur (INDIA)
        </p>
      </div>
    </section>
  );
}
