"use client";
import Link from "next/link";

export function FlashBanner() {
  return (
    <section className="absolute bottom-0 mt-4 w-full overflow-hidden  bg-red-900">
      <div className="relative h-10 w-full">
        <div className="absolute top-1/2 whitespace-nowrap banner-slide">
          <span
            className="text-lg font-semibold text-amber-100 underline underline-offset-4"
            style={{
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)",
            }}
          >
            <Link href="#">Inauguration Coming Soon!</Link>
          </span>
        </div>
      </div>
      <style jsx>{`
        .banner-slide {
          transform: translate(-120%, -50%);
          animation: slide-right 11s linear infinite;
        }

        @keyframes slide-right {
          from {
            transform: translate(-120%, -50%);
          }
          to {
            transform: translate(120vw, -50%);
          }
        }
      `}</style>
    </section>
  );
}
