import { getAboutContent } from "@/lib/data";
import { AboutHero } from "@/components/home/AboutHero";
import { AboutContent } from "@/components/home/AboutContent";
import { FlashBanner } from "@/components/home/FlashBanner";

export default async function HomePage() {
  const about = await getAboutContent();
  return (
    <>
      <AboutHero />
      <FlashBanner />
      <AboutContent content={about ?? undefined} />
    </>
  );
}
