const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// SHIKO KETU: Sigurohu që ky path është i saktë! 
// Nëse skedari është te backend/models/user.js, liroje kështu:
const User = require("./models/user"); 

const salt = bcrypt.genSaltSync(10);

const createDoctors = async () => {
  try {
    // Zëvendësoje me URL-në tënde reale të MongoDB
    await mongoose.connect( "mongodb+srv://MedicalSystem:2E8MxSqfXmAN2WNR@medicalcluster.hs25uwx.mongodb.net/?appName=MedicalCluster");
    console.log("Lidhur me DB...");

    for (let docData of doctors) {
      const existingDoc = await User.findOne({ email: docData.email });
      if (existingDoc) {
        console.log(`Doktori ${docData.email} ekziston.`);
        continue;
      }

      const newDoctor = new User({
        username: docData.username,
        email: docData.email,
        password: bcrypt.hashSync(docData.password, salt),
        role: "doctor",
        department: docData.dept // Sigurohu që modeli 'User' e ka këtë fushë
      });

      await newDoctor.save();
      console.log(`U krijua doktori: ${newDoctor.username} | ID: ${newDoctor._id}`);
    }

    console.log("Përfundoi!");
    mongoose.disconnect();
  } catch (err) {
    console.error("GABIM:", err.message);
    process.exit(1);
  }
};

createDoctors();