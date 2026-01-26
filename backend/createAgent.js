const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./Models/userModel"); 

mongoose.connect(
  "mongodb+srv://deeexh1:Cokollate10@cluster0.0gkrdox.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("MongoDB Atlas connected"))
.catch((err) => console.log(err));

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync("agjent10", salt);

const agent = new userModel({
  username: "agent",
  email: "agjent@pro.com",
  password: hashedPassword,
  role: "agent",
});

agent.save()
  .then(() => {
    console.log("Agent created successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Error creating agent:", err);
    mongoose.connection.close();
  });
