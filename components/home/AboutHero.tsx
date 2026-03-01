export function AboutHero() {
  return (
    <section className="relative -mt-[10vh] h-[110vh] bg-cover bg-center bg-[url('/centralplaza.webp')]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center text-[#ffffff]">
        <h1
          className="text-[5.5vw] font-heading"
          style={{
            textShadow:
              "0 2px 4px rgba(0,0,0,0.9), 0 6px 14px rgba(0,0,0,0.75)",
          }}
        >
          LNMIIT OPTICA STUDENT CHAPTER
        </h1>

        <p
          className="text-3xl max-w-4xl mt-10"
          style={{
            textShadow:
              "0 1px 3px rgba(0,0,0,0.9), 0 4px 10px rgba(0,0,0,0.75)",
          }}
        >
          The LNM Institute of Information Technology, Jaipur (INDIA)
        </p>
      </div>
    </section>
  );
}
