const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@ieee.lnmiit.ac.in" },
    update: {},
    create: {
      email: "admin@ieee.lnmiit.ac.in",
      passwordHash: hash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user: admin@ieee.lnmiit.ac.in / admin123");

  const first = await prisma.aboutContent.findFirst();
  if (!first) {
    await prisma.aboutContent.create({
      data: {
        aboutUs:
          "We are the IEEE Student Chapter at The LNM Institute of Information Technology (LNMIIT), Jaipur. Our chapter fosters technical learning, innovation, and industry engagement through workshops, hackathons, webinars, and invited talks.",
        aboutOptica:
          "Optica (formerly OSA) is a leading society in optics and photonics. Our chapter collaborates with Optica to promote light-based technologies and research among students.",
      },
    });
    console.log("Seeded About content.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
