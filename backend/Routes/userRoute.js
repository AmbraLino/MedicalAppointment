const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const User = require("../Models/userModel");
const Doctor = require("../Models/doctorModel");

const secret = "asdfe45we45w345wegw345werjktjwertkjfdgfgfsgf";

// Konfigurimi i Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// --- REGISTER ---
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ message: "Plotesoni te gjitha fushat" });

    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "Perdoruesi me kete email ekziston" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "Perdoruesi u krijua" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  const user = await User.findOne({ email });
if (!user) {
    console.log("Përdoruesi nuk u gjet në DB"); // Kjo do dalë në terminalin e VS Code
    return res.status(401).json({ message: "Ky email nuk ekziston!" });
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    console.log("Fjalëkalimi nuk përputhet"); // Kjo do dalë në terminalin e VS Code
    return res.status(401).json({ message: "Fjalëkalimi është i gabuar!" });
}
});

// --- LOGIN (I përmirësuar për të kontrolluar të dyja tabelat) ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kërkojmë te User ose Doctor (varet si i ke ndarë)
    let user = await User.findOne({ email });
    if (!user) {
      user = await Doctor.findOne({ email });
    }
    
    if (!user || !user.password) {
      return res.status(401).json({ message: "Email ose fjalëkalim i gabuar" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ose fjalëkalim i gabuar" });
    }

    // PËRDOR 'secret' këtu, jo process.env.JWT_SECRET
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      secret, 
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { 
      httpOnly: true,
      secure: false, // vendose true nese je ne produksion me HTTPS
      sameSite: 'lax' 
    }).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim në server" });
  }
});

// --- GET CURRENT USER (PROFILE) ---
router.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  // Verifikimi me të njëjtin 'secret'
  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    
    try {
      let user = await User.findById(decoded.id).select("-password");
      if (!user) {
        user = await Doctor.findById(decoded.id).select("-password");
      }
      
      if (!user) return res.status(404).json({ message: "User not found" });
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
    path: "/" // Shto këtë për t'u siguruar që fshihet në të gjithë domain-in
  }).json({ message: "Logged out successfully" });
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { username, email, phone, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, phone, image },
      { new: true } // Kjo kthen dokumentin e përditësuar
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Përdoruesi nuk u gjet" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Gabim gjatë përditësimit", error: err.message });
  }
});

module.exports = router;