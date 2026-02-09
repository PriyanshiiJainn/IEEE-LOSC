import Link from "next/link";

export function FlashBanner() {
  return (
    <section className="bg-ieee-red/10 border-b border-ieee-red/20 overflow-hidden">
      <div className="relative w-full h-10">
        <div className="flex animate-marqueeLeftToRight whitespace-nowrap">
          <span className="flex justify-center items-center text-ieee-navy font-semibold mr-16">
            <Link href="#">Inauguration Coming Soon!</Link>
          </span>
        </div>
      </div>
    </section>
  );
}
