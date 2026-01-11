const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const salt = bcrypt.genSaltSync(10);
const createAdmin = async () => {
  try {
    await mongoose.connect("connection with DB");
    const adminEmail = "barkea@admin.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Ky admin ekziston");
      mongoose.disconnect();
      return;
    }
    const admin = new User({
      username: "admin",
      email: "barkea@admin.com",
      password: bcrypt.hashSync("admintest10", salt),
      role: "admin",
    });
    await admin.save();
    console.log("Admini u krijua:", admin.email);
    mongoose.disconnect();
  } catch (err) {
    console.log("Admini nuk u krijua " + err);
    process.exit(1);
  }
};
createAdmin();