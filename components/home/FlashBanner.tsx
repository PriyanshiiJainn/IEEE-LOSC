'use client';
import Link from "next/link";
import type { FlashItem } from "@/lib/data";

export function FlashBanner({ flash }: { flash: FlashItem }) {
  const text = flash.shortMessage || flash.title;
  const href = flash.link ?? (flash.event ? `/events/${flash.event.id}/register` : null);

  return (
    <section className="absolute bottom-0 mt-4 w-full overflow-hidden bg-[#5c0612]">
      <div className="relative h-10 w-full">
        <div className="absolute top-1/2 whitespace-nowrap banner-slide">
          {href ? (
            <Link
              href={href}
              className="text-lg font-semibold text-yellow-200 underline underline-offset-4"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)" }}
            >
              {text}
            </Link>
          ) : (
            <span
              className="text-lg font-semibold text-yellow-200"
              style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.45)" }}
            >
              {text}
            </span>
          )}
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
