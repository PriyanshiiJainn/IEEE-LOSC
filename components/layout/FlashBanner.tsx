import Link from "next/link";

type Flash = {
  id: string;
  title: string;
  shortMessage: string | null;
  link: string | null;
  event: { id: string } | null;
};

export async function FlashBanner() {
  let flash: Flash | null = null;
  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.flashAnnouncement.findFirst({
      where: { active: true },
      include: { event: { select: { id: true } } },
    });
    if (row) flash = row;
  } catch {
    // no DB
  }

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
