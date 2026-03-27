import { getAboutContent, getActiveFlash } from "@/lib/data";
import { AboutHero } from "@/components/home/AboutHero";
import { AboutContent } from "@/components/home/AboutContent";
import { FlashBanner } from "@/components/home/FlashBanner";

export default async function HomePage() {
  const about = await getAboutContent();
  const flash = await getActiveFlash();
  return (
    <>
      <AboutHero />
      {flash && <FlashBanner flash={flash} />}
      <AboutContent content={about ?? undefined} />
    </>
  );
}
