import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, "dev.db"));

function cuid() { return "c" + randomBytes(12).toString("hex"); }
function now() { return new Date().toISOString(); }

async function main() {
  console.log("Seeding database v2...");

  db.exec("DELETE FROM Notification");
  db.exec("DELETE FROM BloodRequest");
  db.exec("DELETE FROM Appointment");
  db.exec("DELETE FROM BloodStock");
  db.exec("DELETE FROM Donation");
  db.exec("DELETE FROM Donor");
  db.exec("DELETE FROM User");
  db.exec("DELETE FROM Hospital");
  db.exec("DELETE FROM Center");

  const hp = await bcrypt.hash("password123", 12);
  const ts = now();

  const insertCenter = db.prepare("INSERT INTO Center (id, name, type, province, address, phone, email, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
  const insertHospital = db.prepare("INSERT INTO Hospital (id, name, province, address, phone, email, type, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
  const insertUser = db.prepare("INSERT INTO User (id, email, password, name, phone, avatar, role, isActive, centerId, hospitalId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NULL, ?, 1, ?, ?, ?, ?)");
  const insertDonor = db.prepare("INSERT INTO Donor (id, matricule, userId, centerId, bloodGroup, rhFactor, dateOfBirth, gender, address, nationalId, weight, lastDonation, isEligible, medicalNotes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NULL, ?, ?)");
  const insertDonation = db.prepare("INSERT INTO Donation (id, donorId, centerId, date, bloodGroup, rhFactor, quantity, status, hemoglobin, bloodPressure, temperature, notes, collectedBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?)");
  const insertStock = db.prepare("INSERT INTO BloodStock (id, donationId, centerId, bloodGroup, rhFactor, quantity, status, collectedAt, expiresAt, storageLocation, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)");
  const insertAppointment = db.prepare("INSERT INTO Appointment (id, donorId, centerId, date, time, status, type, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)");
  const insertBloodRequest = db.prepare("INSERT INTO BloodRequest (id, hospitalId, bloodGroup, rhFactor, quantity, urgency, status, patientInfo, reason, contactName, contactPhone, fulfilledAt, fulfilledBy, notes, isPublic, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, ?, ?, ?)");
  const insertNotification = db.prepare("INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt) VALUES (?, ?, ?, ?, ?, 0, ?)");
  const updateDonorLastDonation = db.prepare("UPDATE Donor SET lastDonation = ? WHERE id = ?");

  // Centers
  const centerHQ = cuid();
  insertCenter.run(centerHQ, "CNTS - Siège N'Djaména", "HEADQUARTERS", "N'Djaména", "Avenue Charles de Gaulle, N'Djaména", "+235 22 51 44 33", "siege@cnts.td", ts, ts);

  const centerMoundou = cuid();
  insertCenter.run(centerMoundou, "Centre Provincial Moundou", "PROVINCIAL", "Logone Occidental", "Quartier Central, Moundou", "+235 22 69 11 22", "moundou@cnts.td", ts, ts);

  const centerAbeche = cuid();
  insertCenter.run(centerAbeche, "Centre Provincial Abéché", "PROVINCIAL", "Ouaddaï", "Avenue Principale, Abéché", "+235 22 69 33 44", "abeche@cnts.td", ts, ts);

  const centerSarh = cuid();
  insertCenter.run(centerSarh, "Centre Provincial Sarh", "PROVINCIAL", "Moyen-Chari", "Rue de l'Hôpital, Sarh", "+235 22 68 11 55", null, ts, ts);

  // Hospitals
  const hopitalGeneral = cuid();
  insertHospital.run(hopitalGeneral, "Hôpital Général de Référence Nationale", "N'Djaména", "Quartier Farcha, N'Djaména", "+235 22 51 20 10", "hgrn@sante.td", "PUBLIC", ts, ts);

  const hopitalMere = cuid();
  insertHospital.run(hopitalMere, "Hôpital de la Mère et de l'Enfant", "N'Djaména", "Quartier Moursal, N'Djaména", "+235 22 51 30 20", "hme@sante.td", "PUBLIC", ts, ts);

  const hopitalMilitaire = cuid();
  insertHospital.run(hopitalMilitaire, "Hôpital Militaire", "N'Djaména", "Camp Militaire, N'Djaména", "+235 22 51 40 30", null, "MILITARY", ts, ts);

  const hopitalLiberte = cuid();
  insertHospital.run(hopitalLiberte, "Clinique La Liberté", "N'Djaména", "Quartier Chagoua, N'Djaména", "+235 66 88 00 11", "clinique@liberte.td", "PRIVATE", ts, ts);

  const hopitalMoundou = cuid();
  insertHospital.run(hopitalMoundou, "Hôpital Provincial de Moundou", "Logone Occidental", "Centre Ville, Moundou", "+235 22 69 22 33", null, "PUBLIC", ts, ts);

  // SuperAdmin (system owner)
  const superAdminId = cuid();
  const superAdminPwd = await bcrypt.hash("Gueyeye@52", 12);
  insertUser.run(superAdminId, "machoukoumy@gmail.com", superAdminPwd, "Oumar Mahamatou", "+235 66 00 00 00", "SUPER_ADMIN", null, null, ts, ts);

  // Admin CNTS HQ
  const adminId = cuid();
  insertUser.run(adminId, "admin@cnts.td", hp, "Dr. Ibrahim Moussa", "+235 66 00 00 01", "ADMIN", centerHQ, null, ts, ts);

  // Admin Moundou
  const adminMoundouId = cuid();
  insertUser.run(adminMoundouId, "admin.moundou@cnts.td", hp, "Dr. Aïssa Nguema", "+235 66 00 00 10", "ADMIN", centerMoundou, null, ts, ts);

  // Personnel
  const p1Id = cuid();
  insertUser.run(p1Id, "personnel1@cnts.td", hp, "Aïcha Mahamat", "+235 66 00 00 02", "PERSONNEL", centerHQ, null, ts, ts);
  const p2Id = cuid();
  insertUser.run(p2Id, "personnel2@cnts.td", hp, "Oumar Abdoulaye", "+235 66 00 00 03", "PERSONNEL", centerHQ, null, ts, ts);

  // Hospital Users
  const hopUserHGRN = cuid();
  insertUser.run(hopUserHGRN, "hgrn@sante.td", hp, "Dr. Fatima Hassan (HGRN)", "+235 66 50 00 01", "HOSPITAL", null, hopitalGeneral, ts, ts);
  const hopUserHME = cuid();
  insertUser.run(hopUserHME, "hme@sante.td", hp, "Dr. Marie Djimet (HME)", "+235 66 50 00 02", "HOSPITAL", null, hopitalMere, ts, ts);
  const hopUserMilitaire = cuid();
  insertUser.run(hopUserMilitaire, "militaire@sante.td", hp, "Cdt. Adam Brahim", "+235 66 50 00 03", "HOSPITAL", null, hopitalMilitaire, ts, ts);

  // Donors
  const donorsData = [
    { name: "Fatima Ali", email: "fatima@email.com", phone: "+235 66 10 00 01", bg: "A", rh: "+", gender: "F", nid: "NID001", addr: "N'Djaména, Moursal", w: 62, dob: "1990-05-15", cid: centerHQ },
    { name: "Hassan Oumar", email: "hassan@email.com", phone: "+235 66 10 00 02", bg: "O", rh: "+", gender: "M", nid: "NID002", addr: "N'Djaména, Chagoua", w: 75, dob: "1988-03-22", cid: centerHQ },
    { name: "Mariam Deby", email: "mariam@email.com", phone: "+235 66 10 00 03", bg: "B", rh: "+", gender: "F", nid: "NID003", addr: "N'Djaména, Diguel", w: 58, dob: "1995-11-08", cid: centerHQ },
    { name: "Abdel Karim", email: "abdel@email.com", phone: "+235 66 10 00 04", bg: "AB", rh: "+", gender: "M", nid: "NID004", addr: "N'Djaména, Farcha", w: 80, dob: "1985-07-30", cid: centerHQ },
    { name: "Khadija Moussa", email: "khadija@email.com", phone: "+235 66 10 00 05", bg: "O", rh: "-", gender: "F", nid: "NID005", addr: "N'Djaména, Amriguébé", w: 55, dob: "1992-01-20", cid: centerHQ },
    { name: "Youssouf Adam", email: "youssouf@email.com", phone: "+235 66 10 00 06", bg: "A", rh: "-", gender: "M", nid: "NID006", addr: "Moundou, Centre", w: 70, dob: "1987-09-12", cid: centerMoundou },
    { name: "Amina Brahim", email: "amina@email.com", phone: "+235 66 10 00 07", bg: "B", rh: "-", gender: "F", nid: "NID007", addr: "Abéché, Quartier Nord", w: 60, dob: "1993-04-05", cid: centerAbeche },
    { name: "Mahamat Saleh", email: "mahamat@email.com", phone: "+235 66 10 00 08", bg: "O", rh: "+", gender: "M", nid: "NID008", addr: "N'Djaména, Bololo", w: 85, dob: "1982-12-18", cid: centerHQ },
    { name: "Djibrine Idriss", email: "djibrine@email.com", phone: "+235 66 10 00 09", bg: "A", rh: "+", gender: "M", nid: "NID009", addr: "Moundou, Koutou", w: 72, dob: "1991-06-25", cid: centerMoundou },
    { name: "Hawa Mahamat", email: "hawa@email.com", phone: "+235 66 10 00 10", bg: "O", rh: "+", gender: "F", nid: "NID010", addr: "Sarh, Centre", w: 56, dob: "1994-08-14", cid: centerSarh },
  ];

  const donors = [];
  let matriculeCounter = 1;
  for (const d of donorsData) {
    const userId = cuid();
    const donorId = cuid();
    const matricule = `VL-2026-${String(matriculeCounter++).padStart(5, "0")}`;
    insertUser.run(userId, d.email, hp, d.name, d.phone, "DONOR", d.cid, null, ts, ts);
    insertDonor.run(donorId, matricule, userId, d.cid, d.bg, d.rh, new Date(d.dob).toISOString(), d.gender, d.addr, d.nid, d.w, null, ts, ts);
    donors.push({ userId, donorId, bg: d.bg, rh: d.rh, cid: d.cid });
  }

  // Donations & Stock
  const nowMs = Date.now();
  const collectors = ["Aïcha Mahamat", "Oumar Abdoulaye"];

  for (let i = 0; i < donors.length; i++) {
    const d = donors[i];
    const num = Math.floor(Math.random() * 3) + 1;
    let lastDate = null;

    for (let j = 0; j < num; j++) {
      const daysAgo = Math.floor(Math.random() * 180) + 1;
      const donDate = new Date(nowMs - daysAgo * 86400000);
      const statuses = ["COLLECTED", "TESTED", "STORED", "STORED"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const donId = cuid();
      const dateStr = donDate.toISOString();

      insertDonation.run(donId, d.donorId, d.cid, dateStr, d.bg, d.rh, 450, status,
        (12 + Math.random() * 4).toFixed(1),
        `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
        (36.5 + Math.random()).toFixed(1),
        collectors[i % 2], ts, ts);

      const expiresAt = new Date(donDate.getTime() + 42 * 86400000);
      const stockStatus = expiresAt.getTime() < nowMs ? "EXPIRED" : status === "STORED" ? "AVAILABLE" : "QUARANTINE";
      insertStock.run(cuid(), donId, d.cid, d.bg, d.rh, 450, stockStatus, dateStr, expiresAt.toISOString(), ts, ts);

      if (!lastDate || donDate > lastDate) lastDate = donDate;
    }
    if (lastDate) updateDonorLastDonation.run(lastDate.toISOString(), d.donorId);
  }

  // Appointments
  const times = ["08:00", "09:00", "10:00", "11:00", "14:00"];
  for (let i = 0; i < 5; i++) {
    const d = donors[i];
    const apptDate = new Date(nowMs + (Math.floor(Math.random() * 14) + 1) * 86400000);
    insertAppointment.run(cuid(), d.donorId, d.cid, apptDate.toISOString(), times[i], i < 2 ? "CONFIRMED" : "SCHEDULED", "DONATION", ts, ts);
  }

  // Blood Requests from Hospitals
  const bloodRequestsData = [
    { hid: hopitalGeneral, bg: "O", rh: "-", qty: 1350, urg: "CRITICAL", reason: "Accident de la route - urgence vitale", contact: "Dr. Fatima Hassan", phone: "+235 66 50 00 01", pub: true },
    { hid: hopitalGeneral, bg: "A", rh: "+", qty: 900, urg: "URGENT", reason: "Chirurgie programmée", contact: "Dr. Ahmed Ali", phone: "+235 66 50 00 05", pub: true },
    { hid: hopitalMere, bg: "O", rh: "+", qty: 450, urg: "CRITICAL", reason: "Hémorragie post-partum", contact: "Dr. Marie Djimet", phone: "+235 66 50 00 02", pub: true },
    { hid: hopitalMere, bg: "B", rh: "+", qty: 450, urg: "NORMAL", reason: "Transfusion pédiatrique", contact: "Dr. Marie Djimet", phone: "+235 66 50 00 02", pub: false },
    { hid: hopitalMilitaire, bg: "AB", rh: "+", qty: 900, urg: "URGENT", reason: "Blessures multiples", contact: "Cdt. Adam Brahim", phone: "+235 66 50 00 03", pub: true },
    { hid: hopitalMoundou, bg: "O", rh: "+", qty: 1350, urg: "URGENT", reason: "Épidémie de paludisme grave", contact: "Dr. Ngarta", phone: "+235 66 70 00 01", pub: true },
    { hid: hopitalLiberte, bg: "A", rh: "-", qty: 450, urg: "NORMAL", reason: "Anémie sévère", contact: "Dr. Djimet", phone: "+235 66 88 00 11", pub: false },
  ];

  const requestIds = [];
  for (const r of bloodRequestsData) {
    const rid = cuid();
    insertBloodRequest.run(rid, r.hid, r.bg, r.rh, r.qty, r.urg, "PENDING", null, r.reason, r.contact, r.phone, r.pub ? 1 : 0, ts, ts);
    requestIds.push({ id: rid, bg: r.bg, rh: r.rh });
  }

  // Donor Responses to Blood Requests
  const insertDonorResponse = db.prepare("INSERT INTO DonorResponse (id, donorId, bloodRequestId, status, message, availableDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  // Fatima (A+) responds to A+ request
  const aRequest = requestIds.find(r => r.bg === "A" && r.rh === "+");
  if (aRequest) {
    insertDonorResponse.run(cuid(), donors[0].donorId, aRequest.id, "ACCEPTED", "Je suis disponible demain matin", "Demain 08:00", ts, ts);
  }

  // Hassan (O+) responds to O+ critical request
  const oRequest = requestIds.find(r => r.bg === "O" && r.rh === "+");
  if (oRequest) {
    insertDonorResponse.run(cuid(), donors[1].donorId, oRequest.id, "ACCEPTED", "Je viens tout de suite", null, ts, ts);
  }

  // Mahamat (O+) also responds
  if (oRequest) {
    insertDonorResponse.run(cuid(), donors[7].donorId, oRequest.id, "ACCEPTED", null, "Cet après-midi", ts, ts);
  }

  // Abdel (AB+) responds to AB+ request
  const abRequest = requestIds.find(r => r.bg === "AB" && r.rh === "+");
  if (abRequest) {
    insertDonorResponse.run(cuid(), donors[3].donorId, abRequest.id, "REFUSED", "Je suis en déplacement cette semaine", null, ts, ts);
  }

  // Khadija (O-) responds to O- critical
  const oNegRequest = requestIds.find(r => r.bg === "O" && r.rh === "-");
  if (oNegRequest) {
    insertDonorResponse.run(cuid(), donors[4].donorId, oNegRequest.id, "ACCEPTED", "Je serai là dans 30 minutes", null, ts, ts);
  }

  // Notifications
  const allUserIds = [superAdminId, adminId, adminMoundouId, p1Id, p2Id, hopUserHGRN, hopUserHME, ...donors.slice(0, 3).map(d => d.userId)];
  for (const uid of allUserIds) {
    insertNotification.run(cuid(), uid, "Bienvenue au CNTS", "Bienvenue dans le système de gestion du Centre National de Transfusion Sanguine.", "INFO", ts);
  }

  insertNotification.run(cuid(), superAdminId, "Demande critique - HGRN", "L'Hôpital Général a une demande critique de sang O-. Action urgente requise.", "ALERT", ts);
  insertNotification.run(cuid(), adminId, "Stock critique - O-", "Le stock de sang O- est en dessous du seuil critique au siège.", "ALERT", ts);
  insertNotification.run(cuid(), hopUserHGRN, "Demande soumise", "Votre demande de sang O- a été soumise avec succès.", "INFO", ts);

  // Eligibility reminders for donors
  insertNotification.run(cuid(), donors[0].userId, "Rappel d'éligibilité", "Vous êtes à nouveau éligible au don de sang. Prenez rendez-vous !", "REMINDER", ts);
  insertNotification.run(cuid(), donors[1].userId, "Appel urgent - Votre groupe O+", "L'Hôpital de la Mère et de l'Enfant a besoin de sang O+ en urgence !", "URGENT", ts);
  insertNotification.run(cuid(), donors[4].userId, "Appel CRITIQUE - Votre groupe O-", "URGENT: L'Hôpital Général a besoin de sang O- pour un accident de la route !", "URGENT", ts);
  insertNotification.run(cuid(), donors[3].userId, "Rappel d'éligibilité", "Cela fait plus de 3 mois depuis votre dernier don. Pensez à redonner !", "REMINDER", ts);
  insertNotification.run(cuid(), donors[7].userId, "Appel urgent - Votre groupe O+", "Plusieurs hôpitaux ont besoin de sang O+ ! Consultez les urgences.", "URGENT", ts);

  console.log("Seed v2 completed!");
  console.log("---");
  console.log("Comptes de test:");
  console.log("  SuperAdmin:  machoukoumy@gmail.com (mdp: Gueyeye@52)");
  console.log("  Admin HQ:    admin@cnts.td");
  console.log("  Admin Prov:  admin.moundou@cnts.td");
  console.log("  Personnel:   personnel1@cnts.td");
  console.log("  Hôpital:     hgrn@sante.td");
  console.log("  Donneur:     fatima@email.com");
}

main().catch(e => { console.error(e); process.exit(1); });
