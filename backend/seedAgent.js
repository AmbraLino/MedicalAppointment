
const mongoose = require("mongoose");
const User = require("./Models/userModel"); 
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://localhost:27017/yourDBName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAgent = async () => {
  try {
    const existing = await User.findOne({ email: "agjent@barkea.com" });
    if (existing) return console.log("Agent already exists");

    const hashedPassword = await bcrypt.hash("agjent10", 10);
    const agent = new User({
      name: "Agjent Barkea",
      email: "agjent@barkea.com",
      password: hashedPassword,
      role: "agent",
    });

    await agent.save();
    console.log("Agent account created!");
    mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};

seedAgent();
