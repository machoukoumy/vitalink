import pg from "pg";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const client = new pg.Client({ connectionString: process.env.DIRECT_URL || "postgresql://postgres.fbvaucsobwtjlgqgikzp:Gueyeye%40524635@aws-0-eu-west-1.pooler.supabase.com:5432/postgres" });

function cuid() { return "c" + randomBytes(12).toString("hex"); }

async function main() {
  await client.connect();
  console.log("Seeding Supabase...");

  // Clean
  for (const t of ["Notification","DonorResponse","DonorRequest","BloodRequest","Appointment","BloodStock","Donation","Donor","User","Hospital","Center","ActivityLog"]) {
    await client.query(`DELETE FROM "${t}"`);
  }

  const hp = await bcrypt.hash("password123", 12);
  const superPwd = await bcrypt.hash("Gueyeye@52", 12);
  const now = new Date().toISOString();

  // Centers
  const centerHQ = cuid();
  await client.query(`INSERT INTO "Center" (id,name,type,province,address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$8)`, [centerHQ,"CNTS - Siège N'Djaména","HEADQUARTERS","N'Djaména","Avenue Charles de Gaulle","'+235 22 51 44 33","siege@cnts.td",now]);
  const centerMoundou = cuid();
  await client.query(`INSERT INTO "Center" (id,name,type,province,address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$8)`, [centerMoundou,"Centre Provincial Moundou","PROVINCIAL","Logone Occidental","Quartier Central, Moundou","+235 22 69 11 22","moundou@cnts.td",now]);
  const centerAbeche = cuid();
  await client.query(`INSERT INTO "Center" (id,name,type,province,address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$8)`, [centerAbeche,"Centre Provincial Abéché","PROVINCIAL","Ouaddaï","Avenue Principale, Abéché","+235 22 69 33 44","abeche@cnts.td",now]);
  const centerSarh = cuid();
  await client.query(`INSERT INTO "Center" (id,name,type,province,address,phone,email,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$8)`, [centerSarh,"Centre Provincial Sarh","PROVINCIAL","Moyen-Chari","Rue de l'Hôpital, Sarh",null,null,now]);

  // Hospitals
  const hopGen = cuid(), hopMere = cuid(), hopMil = cuid(), hopLib = cuid(), hopMound = cuid();
  for (const [id,name,prov,addr,ph,em,type] of [
    [hopGen,"Hôpital Général de Référence Nationale","N'Djaména","Quartier Farcha","+235 22 51 20 10","hgrn@sante.td","PUBLIC"],
    [hopMere,"Hôpital de la Mère et de l'Enfant","N'Djaména","Quartier Moursal","+235 22 51 30 20","hme@sante.td","PUBLIC"],
    [hopMil,"Hôpital Militaire","N'Djaména","Camp Militaire","+235 22 51 40 30",null,"MILITARY"],
    [hopLib,"Clinique La Liberté","N'Djaména","Quartier Chagoua","+235 66 88 00 11","clinique@liberte.td","PRIVATE"],
    [hopMound,"Hôpital Provincial de Moundou","Logone Occidental","Centre Ville","+235 22 69 22 33",null,"PUBLIC"],
  ]) {
    await client.query(`INSERT INTO "Hospital" (id,name,province,address,phone,email,type,"isActive","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8,$8)`, [id,name,prov,addr,ph,em,type,now]);
  }

  // Users
  const insertUser = async (id,email,pwd,name,phone,role,centerId,hospitalId) => {
    await client.query(`INSERT INTO "User" (id,email,password,name,phone,avatar,role,"isActive","centerId","hospitalId","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,null,$6,true,$7,$8,$9,$9)`, [id,email,pwd,name,phone,role,centerId,hospitalId,now]);
  };

  const saId = cuid();
  await insertUser(saId,"machoukoumy@gmail.com",superPwd,"Oumar Mahamatou","+235 66 00 00 00","SUPER_ADMIN",null,null);
  const adminId = cuid();
  await insertUser(adminId,"admin@cnts.td",hp,"Dr. Ibrahim Moussa","+235 66 00 00 01","ADMIN",centerHQ,null);
  const adminMId = cuid();
  await insertUser(adminMId,"admin.moundou@cnts.td",hp,"Dr. Aïssa Nguema","+235 66 00 00 10","ADMIN",centerMoundou,null);
  const p1Id = cuid();
  await insertUser(p1Id,"personnel1@cnts.td",hp,"Aïcha Mahamat","+235 66 00 00 02","PERSONNEL",centerHQ,null);
  const p2Id = cuid();
  await insertUser(p2Id,"personnel2@cnts.td",hp,"Oumar Abdoulaye","+235 66 00 00 03","PERSONNEL",centerHQ,null);
  const hUser1 = cuid();
  await insertUser(hUser1,"hgrn@sante.td",hp,"Dr. Fatima Hassan (HGRN)","+235 66 50 00 01","HOSPITAL",null,hopGen);
  const hUser2 = cuid();
  await insertUser(hUser2,"hme@sante.td",hp,"Dr. Marie Djimet (HME)","+235 66 50 00 02","HOSPITAL",null,hopMere);
  const hUser3 = cuid();
  await insertUser(hUser3,"militaire@sante.td",hp,"Cdt. Adam Brahim","+235 66 50 00 03","HOSPITAL",null,hopMil);

  // Donors
  const donorsData = [
    {name:"Fatima Ali",email:"fatima@email.com",ph:"+235 66 10 00 01",bg:"A",rh:"+",g:"F",nid:"NID001",addr:"N'Djaména, Moursal",w:62,dob:"1990-05-15",cid:centerHQ},
    {name:"Hassan Oumar",email:"hassan@email.com",ph:"+235 66 10 00 02",bg:"O",rh:"+",g:"M",nid:"NID002",addr:"N'Djaména, Chagoua",w:75,dob:"1988-03-22",cid:centerHQ},
    {name:"Mariam Deby",email:"mariam@email.com",ph:"+235 66 10 00 03",bg:"B",rh:"+",g:"F",nid:"NID003",addr:"N'Djaména, Diguel",w:58,dob:"1995-11-08",cid:centerHQ},
    {name:"Abdel Karim",email:"abdel@email.com",ph:"+235 66 10 00 04",bg:"AB",rh:"+",g:"M",nid:"NID004",addr:"N'Djaména, Farcha",w:80,dob:"1985-07-30",cid:centerHQ},
    {name:"Khadija Moussa",email:"khadija@email.com",ph:"+235 66 10 00 05",bg:"O",rh:"-",g:"F",nid:"NID005",addr:"N'Djaména, Amriguébé",w:55,dob:"1992-01-20",cid:centerHQ},
    {name:"Youssouf Adam",email:"youssouf@email.com",ph:"+235 66 10 00 06",bg:"A",rh:"-",g:"M",nid:"NID006",addr:"Moundou, Centre",w:70,dob:"1987-09-12",cid:centerMoundou},
    {name:"Amina Brahim",email:"amina@email.com",ph:"+235 66 10 00 07",bg:"B",rh:"-",g:"F",nid:"NID007",addr:"Abéché, Nord",w:60,dob:"1993-04-05",cid:centerAbeche},
    {name:"Mahamat Saleh",email:"mahamat@email.com",ph:"+235 66 10 00 08",bg:"O",rh:"+",g:"M",nid:"NID008",addr:"N'Djaména, Bololo",w:85,dob:"1982-12-18",cid:centerHQ},
  ];

  const donors = [];
  let mc = 1;
  for (const d of donorsData) {
    const uid = cuid(), did = cuid(), mat = `VL-2026-${String(mc++).padStart(5,"0")}`;
    await insertUser(uid,d.email,hp,d.name,d.ph,"DONOR",d.cid,null);
    await client.query(`INSERT INTO "Donor" (id,matricule,"userId","centerId","bloodGroup","rhFactor","dateOfBirth",gender,address,"nationalId",weight,"lastDonation","isEligible","medicalNotes","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,null,true,null,$12,$12)`, [did,mat,uid,d.cid,d.bg,d.rh,new Date(d.dob).toISOString(),d.g,d.addr,d.nid,d.w,now]);
    donors.push({uid,did,bg:d.bg,rh:d.rh,cid:d.cid});
  }

  // Donations
  const nowMs = Date.now();
  const cols = ["Aïcha Mahamat","Oumar Abdoulaye"];
  for (let i = 0; i < donors.length; i++) {
    const d = donors[i];
    const num = Math.floor(Math.random()*3)+1;
    let lastDate = null;
    for (let j = 0; j < num; j++) {
      const daysAgo = Math.floor(Math.random()*180)+1;
      const donDate = new Date(nowMs - daysAgo*86400000);
      const sts = ["COLLECTED","TESTED","STORED","STORED"];
      const st = sts[Math.floor(Math.random()*sts.length)];
      const donId = cuid();
      await client.query(`INSERT INTO "Donation" (id,"donorId","centerId",date,"bloodGroup","rhFactor",quantity,status,hemoglobin,"bloodPressure",temperature,notes,"collectedBy","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,450,$7,$8,$9,$10,null,$11,$12,$12)`,
        [donId,d.did,d.cid,donDate.toISOString(),d.bg,d.rh,st,(12+Math.random()*4).toFixed(1),`${110+Math.floor(Math.random()*30)}/${70+Math.floor(Math.random()*20)}`,(36.5+Math.random()).toFixed(1),cols[i%2],now]);
      const exp = new Date(donDate.getTime()+42*86400000);
      const sst = exp.getTime()<nowMs?"EXPIRED":st==="STORED"?"AVAILABLE":"QUARANTINE";
      await client.query(`INSERT INTO "BloodStock" (id,"donationId","centerId","bloodGroup","rhFactor",quantity,status,"collectedAt","expiresAt","storageLocation","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,450,$6,$7,$8,null,$9,$9)`,
        [cuid(),donId,d.cid,d.bg,d.rh,sst,donDate.toISOString(),exp.toISOString(),now]);
      if (!lastDate || donDate>lastDate) lastDate = donDate;
    }
    if (lastDate) await client.query(`UPDATE "Donor" SET "lastDonation"=$1 WHERE id=$2`, [lastDate.toISOString(),d.did]);
  }

  // Blood Requests
  const requests = [
    [hopGen,"O","-",1350,"CRITICAL","Accident de la route","Dr. Fatima Hassan","+235 66 50 00 01",true],
    [hopGen,"A","+",900,"URGENT","Chirurgie programmée","Dr. Ahmed Ali","+235 66 50 00 05",true],
    [hopMere,"O","+",450,"CRITICAL","Hémorragie post-partum","Dr. Marie Djimet","+235 66 50 00 02",true],
    [hopMere,"B","+",450,"NORMAL","Transfusion pédiatrique","Dr. Marie Djimet","+235 66 50 00 02",false],
    [hopMil,"AB","+",900,"URGENT","Blessures multiples","Cdt. Adam Brahim","+235 66 50 00 03",true],
    [hopMound,"O","+",1350,"URGENT","Paludisme grave","Dr. Ngarta","+235 66 70 00 01",true],
  ];
  for (const [hid,bg,rh,qty,urg,reason,contact,phone,pub] of requests) {
    await client.query(`INSERT INTO "BloodRequest" (id,"hospitalId","bloodGroup","rhFactor",quantity,urgency,status,"patientInfo",reason,"contactName","contactPhone","fulfilledAt","fulfilledBy",notes,"isPublic","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,'PENDING',null,$7,$8,$9,null,null,null,$10,$11,$11)`,
      [cuid(),hid,bg,rh,qty,urg,reason,contact,phone,pub,now]);
  }

  // Notifications
  for (const uid of [saId,adminId,p1Id,hUser1,...donors.slice(0,3).map(d=>d.uid)]) {
    await client.query(`INSERT INTO "Notification" (id,"userId",title,message,type,"isRead","createdAt") VALUES ($1,$2,$3,$4,'INFO',false,$5)`,
      [cuid(),uid,"Bienvenue sur VitaLink","Bienvenue dans le système de gestion du don de sang.",now]);
  }

  await client.end();
  console.log("Seed completed!");
  console.log("---");
  console.log("SuperAdmin: machoukoumy@gmail.com / Gueyeye@52");
  console.log("Admin:      admin@cnts.td / password123");
  console.log("Personnel:  personnel1@cnts.td / password123");
  console.log("Hôpital:    hgrn@sante.td / password123");
  console.log("Donneur:    fatima@email.com / password123");
}

main().catch(e => { console.error(e); process.exit(1); });
