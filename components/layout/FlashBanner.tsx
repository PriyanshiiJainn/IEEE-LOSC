import Link from "next/link";
import { getActiveFlash } from "@/lib/data";

export async function FlashBanner() {
  const flash = await getActiveFlash();
  if (!flash) return null;

  const href = flash.link || (flash.event ? `/events#event-${flash.event.id}` : "#");

  return (
    <section className="bg-ieee-red/10 border-b border-ieee-red/20">
      <div className="container mx-auto px-4 py-3">
        <Link
          href={href}
          className="block text-center text-ieee-navy hover:text-ieee-red transition"
        >
          <span className="font-semibold">{flash.title}</span>
          {flash.shortMessage && (
            <span className="ml-2 text-sm opacity-90">{flash.shortMessage}</span>
          )}
        </Link>
      </div>
    </section>
  );
}
