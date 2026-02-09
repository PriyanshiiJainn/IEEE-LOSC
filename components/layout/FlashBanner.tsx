import Link from "next/link";

export function FlashBanner() {
  return (
    <section className="bg-ieee-red/10 border-b border-ieee-red/20 overflow-hidden">
      <div className="relative w-full">
        <div className="flex animate-marqueeLeftToRight whitespace-nowrap">
          <span className="text-ieee-navy font-semibold mr-16">
            <Link href="#">Inauguration Coming Soon!</Link>
          </span>
        </div>
      </div>
    </section>
  );
}
