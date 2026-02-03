const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@ieee.lnmiit.ac.in";
  const adminPassword = "admin123";
  const hash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, name: "Admin", role: "ADMIN" },
    create: {
      email: adminEmail,
      passwordHash: hash,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("Admin login — Email:", adminEmail, "| Password:", adminPassword);

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
    console.error(e.message || e);
    if (String(e.message || "").includes("Can't reach database") || e.code === "P1001") {
      console.error("\n→ Cannot reach database. Try: 1) Resume your Neon project at https://console.neon.tech  2) Check DATABASE_URL in .env  3) Check network. Then run: npm run db:seed");
    }
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
