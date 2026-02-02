// // adminController.js ose userController.js
// const User = require("../models/user");
// const bcrypt = require("bcrypt");

// exports.addDoctor = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Kontrollojmë nëse ekziston ky email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Ky email ekziston!" });

//     // Krijojmë doktorin e ri me rolin "doctor"
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newDoctor = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: "doctor" // Kjo e bën unik dhe i jep akses te Dashboard
//     });

//     await newDoctor.save();
//     res.status(201).json({ message: "Doktori u krijua me sukses!" });
//   } catch (err) {
//     res.status(500).json({ message: "Gabim në server", err });
//   }
// };


