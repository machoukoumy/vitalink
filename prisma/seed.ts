import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bloodStock.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@cnts.td",
      password: hashedPassword,
      name: "Dr. Ibrahim Moussa",
      phone: "+235 66 00 00 01",
      role: "ADMIN",
    },
  });

  const personnel1 = await prisma.user.create({
    data: {
      email: "personnel1@cnts.td",
      password: hashedPassword,
      name: "Aïcha Mahamat",
      phone: "+235 66 00 00 02",
      role: "PERSONNEL",
    },
  });

  const personnel2 = await prisma.user.create({
    data: {
      email: "personnel2@cnts.td",
      password: hashedPassword,
      name: "Oumar Abdoulaye",
      phone: "+235 66 00 00 03",
      role: "PERSONNEL",
    },
  });

  const donorsData = [
    { name: "Fatima Ali", email: "fatima@email.com", phone: "+235 66 10 00 01", bloodGroup: "A", rhFactor: "+", gender: "F", nationalId: "NID001", address: "N'Djaména, Quartier Moursal", weight: 62, dob: "1990-05-15" },
    { name: "Hassan Oumar", email: "hassan@email.com", phone: "+235 66 10 00 02", bloodGroup: "O", rhFactor: "+", gender: "M", nationalId: "NID002", address: "N'Djaména, Quartier Chagoua", weight: 75, dob: "1988-03-22" },
    { name: "Mariam Deby", email: "mariam@email.com", phone: "+235 66 10 00 03", bloodGroup: "B", rhFactor: "+", gender: "F", nationalId: "NID003", address: "N'Djaména, Quartier Diguel", weight: 58, dob: "1995-11-08" },
    { name: "Abdel Karim", email: "abdel@email.com", phone: "+235 66 10 00 04", bloodGroup: "AB", rhFactor: "+", gender: "M", nationalId: "NID004", address: "N'Djaména, Quartier Farcha", weight: 80, dob: "1985-07-30" },
    { name: "Khadija Moussa", email: "khadija@email.com", phone: "+235 66 10 00 05", bloodGroup: "O", rhFactor: "-", gender: "F", nationalId: "NID005", address: "N'Djaména, Quartier Amriguébé", weight: 55, dob: "1992-01-20" },
    { name: "Youssouf Adam", email: "youssouf@email.com", phone: "+235 66 10 00 06", bloodGroup: "A", rhFactor: "-", gender: "M", nationalId: "NID006", address: "Moundou, Centre", weight: 70, dob: "1987-09-12" },
    { name: "Amina Brahim", email: "amina@email.com", phone: "+235 66 10 00 07", bloodGroup: "B", rhFactor: "-", gender: "F", nationalId: "NID007", address: "Abéché, Quartier Nord", weight: 60, dob: "1993-04-05" },
    { name: "Mahamat Saleh", email: "mahamat@email.com", phone: "+235 66 10 00 08", bloodGroup: "O", rhFactor: "+", gender: "M", nationalId: "NID008", address: "N'Djaména, Quartier Bololo", weight: 85, dob: "1982-12-18" },
  ];

  const donors = [];
  for (const d of donorsData) {
    const user = await prisma.user.create({
      data: {
        email: d.email,
        password: hashedPassword,
        name: d.name,
        phone: d.phone,
        role: "DONOR",
        donor: {
          create: {
            bloodGroup: d.bloodGroup,
            rhFactor: d.rhFactor,
            dateOfBirth: new Date(d.dob),
            gender: d.gender,
            address: d.address,
            nationalId: d.nationalId,
            weight: d.weight,
          },
        },
      },
      include: { donor: true },
    });
    donors.push(user);
  }

  const now = new Date();
  const donationsData = [];

  for (let i = 0; i < donors.length; i++) {
    const donor = donors[i].donor!;
    const numDonations = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < numDonations; j++) {
      const daysAgo = Math.floor(Math.random() * 180) + 1;
      const donationDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const statuses = ["COLLECTED", "TESTED", "STORED", "STORED"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const donation = await prisma.donation.create({
        data: {
          donorId: donor.id,
          date: donationDate,
          bloodGroup: donor.bloodGroup,
          rhFactor: donor.rhFactor,
          quantity: 450,
          status,
          hemoglobin: 12 + Math.random() * 4,
          bloodPressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
          temperature: 36.5 + Math.random() * 1,
          collectedBy: i % 2 === 0 ? personnel1.name : personnel2.name,
        },
      });

      donationsData.push(donation);

      const expiresAt = new Date(donationDate.getTime() + 42 * 24 * 60 * 60 * 1000);
      const stockStatus = expiresAt < now ? "EXPIRED" : status === "STORED" ? "AVAILABLE" : "QUARANTINE";

      await prisma.bloodStock.create({
        data: {
          donationId: donation.id,
          bloodGroup: donor.bloodGroup,
          rhFactor: donor.rhFactor,
          quantity: 450,
          status: stockStatus,
          collectedAt: donationDate,
          expiresAt,
        },
      });
    }

    if (donationsData.length > 0) {
      const lastDonation = donationsData
        .filter(d => d.donorId === donor.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (lastDonation) {
        await prisma.donor.update({
          where: { id: donor.id },
          data: { lastDonation: lastDonation.date },
        });
      }
    }
  }

  const appointmentDonors = donors.slice(0, 5);
  for (let i = 0; i < appointmentDonors.length; i++) {
    const donor = appointmentDonors[i].donor!;
    const daysFromNow = Math.floor(Math.random() * 14) + 1;
    const apptDate = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    const times = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"];

    await prisma.appointment.create({
      data: {
        donorId: donor.id,
        date: apptDate,
        time: times[i % times.length],
        status: i < 2 ? "CONFIRMED" : "SCHEDULED",
        type: "DONATION",
      },
    });
  }

  for (const user of [admin, personnel1, personnel2, ...donors.slice(0, 3).map(d => d)]) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Bienvenue au CNTS",
        message: "Bienvenue dans le système de gestion du Centre National de Transfusion Sanguine.",
        type: "INFO",
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: "Stock critique - O-",
      message: "Le stock de sang O- est en dessous du seuil critique. Action requise.",
      type: "ALERT",
    },
  });

  console.log("Seed completed!");
  console.log("---");
  console.log("Comptes de test (mot de passe: password123):");
  console.log(`  Admin:     admin@cnts.td`);
  console.log(`  Personnel: personnel1@cnts.td`);
  console.log(`  Donneur:   fatima@email.com`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
