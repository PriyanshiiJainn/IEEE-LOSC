import { prisma } from "@/lib/prisma";
import { AboutHero } from "@/components/home/AboutHero";
import { AboutContent } from "@/components/home/AboutContent";

export default async function HomePage() {
  let about = null;
  try {
    about = await prisma.aboutContent.findFirst();
  } catch {
    // DB not set up yet
  }

  return (
    <>
      <AboutHero />
      <AboutContent content={about} />
    </>
  );
}
