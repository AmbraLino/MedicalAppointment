const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const User = require("../Models/userModel");
const Doctor = require("../Models/doctorModel");

// 1. Konfigurimi i Multer për ruajtjen e fotove të pacientëve
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 2. --- REGISTER ---
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ message: "complete all the fields" });

    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "User with this email already exists!" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. --- LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Doctor.findOne({ email });
    }
    
    if (!user || !user.password) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { 
      httpOnly: true,
      secure: false,
      sameSite: 'lax' 
    }).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 4. --- GET PROFILE (I saktësuar që të kthejë .image për React) ---
router.get("/profile", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    
    try {
      let user = await User.findById(decoded.id).select("-password");
      if (!user) {
        user = await Doctor.findById(decoded.id).select("-password");
      }
      
      if (!user) return res.status(404).json({ message: "User not found" });
      
      // Këtu bëjmë konvertimin në objekt që React të lexojë .image
      const userToReturn = user.toObject();
      userToReturn.image = user.profilePic || user.image; 
      
      res.status(200).json(userToReturn);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});

// 5. --- LOGOUT ---
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
    path: "/" 
  }).json({ message: "Logged out successfully" });
});

// 6. --- UPDATE PROFILE (Ruan në profilePic dhe kthen .image te Frontend) ---
router.put("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone
    };

    if (req.file) {
      updateData.profilePic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userToReturn = updatedUser.toObject();
    userToReturn.image = updatedUser.profilePic;

    res.status(200).json(userToReturn);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

module.exports = router;