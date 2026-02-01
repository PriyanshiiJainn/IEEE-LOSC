import { getAboutContent } from "@/lib/data";
import { AboutHero } from "@/components/home/AboutHero";
import { AboutContent } from "@/components/home/AboutContent";

export default async function HomePage() {
  const about = await getAboutContent();
  return (
    <>
      <AboutHero />
      <AboutContent content={about} />
    </>
  );
}
