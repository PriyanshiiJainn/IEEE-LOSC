const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { getDefaultGallerySeedRows } = require("../lib/gallery-defaults.js");

const prisma = new PrismaClient();

const LEGACY_GALLERY_PLACEHOLDER_URLS = new Set([
  "/image1.png",
  "/image2.png",
  "/image4.png",
  "/image5.png",
  "/image.png",
  "/image6.png",
  "/image7.png",
  "/image8.png",
  "/image3.png",
]);

async function main() {
  // --- Admin user ---
  const adminEmail = "admin@ieee.lnmiit.ac.in";
  const adminPassword = "admin123";
  const hash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, name: "Admin", role: "ADMIN" },
    create: { email: adminEmail, passwordHash: hash, name: "Admin", role: "ADMIN" },
  });
  console.log("Admin login — Email:", adminEmail, "| Password:", adminPassword);

  // --- About Content ---
  const existingAbout = await prisma.aboutContent.findFirst();
  if (!existingAbout) {
    await prisma.aboutContent.create({
      data: {
        aboutUs: [
          "The LNM Institute of Information Technology (LNMIIT), Jaipur, presently provides a range of optics and photonics programs.",
          "",
          "➤ The Physics Department at LNMIIT clearly identifies optics as one of its research interests, along with cosmology, high-energy physics, material science, photovoltaics, biosensors, and nanotechnology.",
          "",
          "➤ LNMIIT has three specialized research centres — Centre for Material Science and Nano Electronics, Centre for VLSI and Embedded System Design (C-VESD), and Centre for Quantum Computing, Communication, Sensing and Security.",
          "",
          "➤ LNMIIT has a specialized Silicon Photonics Research Group within the ECE Department. Their study domains encompass:",
        ].join("\n"),
        aboutOptica:
          "Optica, formerly known as OSA, is a leading organization dedicated to advancing optics and photonics worldwide, promoting knowledge generation, application, and dissemination in the field.",
        recentUpdates: [
          "We are pleased to inform you about the inaugural event of the LNMIIT Optica Student Chapter LOSC at The LNM Institute of Information Technology, Jaipur.",
          "Event date: 12th March 2026 (10:00 AM; Thursday)",
          "Venue: LT-17, RIEP Building.",
        ].join("\n"),
      },
    });
    console.log("Seeded About content.");
  }

  // --- Footer Links ---
  const existingLinks = await prisma.footerLink.count();
  if (existingLinks === 0) {
    await prisma.footerLink.createMany({
      data: [
        { label: "IEEE", url: "https://www.ieee.org/", order: 0 },
        { label: "LNMIIT", url: "https://www.lnmiit.ac.in/", order: 1 },
        { label: "ASME", url: "https://asme.lnmiit.ac.in/", order: 2 },
        { label: "ACM", url: "https://lnmiit.acm.org/", order: 3 },
      ],
    });
    console.log("Seeded Footer links.");
  }

  // --- Team Members ---
  const existingTeam = await prisma.teamMember.count();
  if (existingTeam === 0) {
    await prisma.teamMember.createMany({
      data: [
        { name: "Harshvardhan Kumar", classification: "FACULTY_ADVISOR", post: "Advisor of LOSC, Assistant Professor, ECE & Head of Silicon Photonics Research Group, LNMIIT", imageUrl: "/faculty_advisor.jpeg", email: "harshvardhan.kumar@lnmiit.ac.in", phone: "+917276373776", order: 0 },
        { name: "Neha Soni", classification: "CORE", post: "President", imageUrl: "/President.jpeg", email: "21dec008@lnmiit.ac.in", phone: "+917665125804", order: 1 },
        { name: "Yash Bijawat", classification: "CORE", post: "Vice President", imageUrl: "/Vice_President.jpeg", email: "22uec146@lnmiit.ac.in", phone: "+917597309945", order: 2 },
        { name: "Sonali Rana", classification: "CORE", post: "Secretary", imageUrl: "/Secretary.jpeg", email: "25mec003@lnmiit.ac.in", phone: "+919418240014", order: 3 },
        { name: "Som Mudgil", classification: "CORE", post: "Treasurer", imageUrl: "/treasurer.jpeg", email: "22uec133@lnmiit.ac.in", phone: "+918957858317", order: 4 },
        { name: "Jyoti Tater", classification: "CORE", post: "Officer", imageUrl: "/officer.jpeg", email: "22uec059@lnmiit.ac.in", phone: "+917073781288", order: 5 },
        { name: "Priyanshi Jain", classification: "FUNCTIONAL", post: "Web Development (Lead)", imageUrl: "/WebdLead.jpeg", email: "24uec249@lnmiit.ac.in", phone: "+919119147959", order: 6 },
        { name: "Vanshita Chotwani", classification: "FUNCTIONAL", post: "Web Development (Member)", imageUrl: "/WebdMember.jpeg", email: "24uec222@lnmiit.ac.in", phone: "+919782801181", order: 7 },
        { name: "Nandini Sharma", classification: "FUNCTIONAL", post: "Content Creation (Lead)", imageUrl: "/ContentLead.jpeg", email: "24dec034@lnmiit.ac.in", phone: "+918822796132", order: 8 },
        { name: "Vanshita Chotwani", classification: "FUNCTIONAL", post: "Content Creation (Member)", imageUrl: "/WebdMember.jpeg", email: "24uec222@lnmiit.ac.in", phone: "+919782801181", order: 9 },
        { name: "Riddhima Agarwal", classification: "FUNCTIONAL", post: "Event Management (Lead)", imageUrl: "/EventLead.jpeg", email: "24uec076@lnmiit.ac.in", phone: "+916377284431", order: 10 },
        { name: "Amrit Mishra", classification: "FUNCTIONAL", post: "Event Management (Member)", imageUrl: "/EventMember.jpeg", email: "24dec051@lnmiit.ac.in", phone: "+917217427440", order: 11 },
      ],
    });
    console.log("Seeded Team members.");
  }

  // --- Events ---
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: "Annual Workshop 2025",
          description:
            "An Annual Workshop will be organized to provide hands-on learning in emerging technologies. The session will offer expert guidance and practical exposure to enhance students' technical skills.",
          date: new Date("2025-03-15"),
          time: "10:00 AM",
          venue: "LNMIIT Campus",
          category: "WORKSHOP",
          isFeatured: true,
          registrationClosed: false,
          registrationStatus: "OPEN",
        },
        {
          title: "IEEE Hackathon",
          description:
            "A 24-hour innovation challenge where students collaborate to build real-world tech solutions from scratch. Guided by mentors, teams design, develop, and pitch impactful prototypes in a fast-paced environment.",
          date: new Date("2025-04-20"),
          time: "9:00 AM",
          venue: "Lab Block",
          category: "HACKATHON",
          isFeatured: true,
          registrationClosed: false,
          registrationStatus: "SOON",
        },
        {
          title: "Tech Quiz",
          description:
            "An exciting Tech Quiz will be organized to test students' knowledge in technology and emerging trends, challenging their technical awareness and quick-thinking skills.",
          date: new Date("2025-05-10"),
          time: "2:00 PM",
          venue: "Seminar Hall",
          category: "QUIZ",
          isFeatured: true,
          registrationClosed: true,
          registrationStatus: "CLOSED",
        },
      ],
    });
    console.log("Seeded Events.");

    // Seed one event report linked to the first event
    const workshop = await prisma.event.findFirst({ where: { title: "Annual Workshop 2025" } });
    if (workshop) {
      await prisma.eventReport.create({
        data: {
          eventId: workshop.id,
          title: "Annual Workshop 2024 Report",
          content: "Summary and highlights from the workshop.",
          publishedAt: new Date("2024-04-01"),
        },
      });
      console.log("Seeded Event report.");
    }
  }

  // --- Gallery Images (bundled DSC* photos under public/gallery; admin can add/reorder/edit later) ---
  const galleryCount = await prisma.galleryImage.count();
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({ data: getDefaultGallerySeedRows() });
    console.log("Seeded Gallery images (DSC defaults under /public/gallery).");
  } else {
    const galleryRows = await prisma.galleryImage.findMany({
      select: { imageUrl: true },
    });
    const onlyLegacyPlaceholders =
      galleryRows.length === LEGACY_GALLERY_PLACEHOLDER_URLS.size &&
      galleryRows.every((r) => LEGACY_GALLERY_PLACEHOLDER_URLS.has(r.imageUrl));
    if (onlyLegacyPlaceholders) {
      await prisma.galleryImage.deleteMany({});
      await prisma.galleryImage.createMany({ data: getDefaultGallerySeedRows() });
      console.log("Replaced legacy placeholder gallery with DSC defaults.");
    }
  }

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
