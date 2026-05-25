const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user"); 

const salt = bcrypt.genSaltSync(10);

const createDoctors = async () => {
  try {
    await mongoose.connect( "mongodb+srv://MedicalSystem:2E8MxSqfXmAN2WNR@medicalcluster.hs25uwx.mongodb.net/?appName=MedicalCluster");
    console.log("is connected to DB...");

    for (let docData of doctors) {
      const existingDoc = await User.findOne({ email: docData.email });
      if (existingDoc) {
        console.log(`The doctor ${docData.email} exists.`);
        continue;
      }

      const newDoctor = new User({
        username: docData.username,
        email: docData.email,
        password: bcrypt.hashSync(docData.password, salt),
        role: "doctor",
        department: docData.dept ,// Sigurohemi qe modeli 'User' e ka kete fushe
        specialty: docData.specialty, 
        description: docData.description ,
      });

      await newDoctor.save();
      console.log(`The doctor was created: ${newDoctor.username} | ID: ${newDoctor._id}`);
    }

    console.log("Finish!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
};

createDoctors();