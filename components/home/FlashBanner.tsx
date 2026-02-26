import Link from "next/link";

export function FlashBanner() {
  return (
    <section className="mt-4 bg-red-600/15 border-b border-red-500/30 overflow-hidden">
      <div className="relative w-full h-14 flex items-center justify-center">
        <div className="animate-marqueeLeftToRight whitespace-nowrap">
          <span className="text-red-600 font-semibold text-lg underline">
            <Link href="#">Inauguration Coming Soon!</Link>
          </span>
        </div>
      </div>
    </section>
  );
}
