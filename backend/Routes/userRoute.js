const express = require("express");
const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const secret = "asdfe45we45w345wegw345werjktjwertkjfdgfgfsgf";
const salt = bcrypt.genSaltSync(10);

router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        if (!username || !email || !password)
            return res.status(400).json({ message: "Plotesoni te gjitha fushat" });
        if (password.length < 6)
            return res.status(400).json({ message: "Fjalekalimi duhet te kete te pakten 6 karaktere" });

        const foundUser = await userModel.findOne({ email });
        if (foundUser)
            return res.status(400).json({ message: "Perdoruesi me kete email ekziston" });

        const newUser = new userModel({
            username,
            email,
            password: bcrypt.hashSync(password, salt),
            role: role || "user",
        });

        await newUser.save();
        res.status(201).json({ message: "Perdoruesi u krijua", user: { username, email, role: newUser.role } });
    } catch (err) {
        res.status(500).json({ message: "Dicka shkoi gabim: " + err.message });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Ju lutem plotësoni email dhe fjalëkalimin" });
    }

    try {
        const findUser = await userModel.findOne({ email });
        if (!findUser) return res.status(400).json({ message: "Kredencialet janë gabim" });

        const passOk = bcrypt.compareSync(password, findUser.password);
        if (!passOk) return res.status(400).json({ message: "Kredencialet janë gabim" });

     const token = jwt.sign(
    {
        id: findUser._id,
        _id: findUser._id, 
        role: findUser.role,
        email: findUser.email,
        username: findUser.username
    },
    secret,
    { expiresIn: "1d" }
);


        res
            .cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: "Lax",
                secure: false, 
            })
            .status(200)
            .json({ role: findUser.role, username: findUser.username, email: findUser.email });

    } catch (err) {
        res.status(500).json({ message: "Dicka shkoi gabim: " + err.message });
    }
});

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
        
    try {
  const user = await userModel.findById(decoded.id).select("-password");


      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});


//api per ti ber update te dhenat e userit (nga useri vet)

router.put("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, {}, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    try {
      const { username, email, phone, profilePic } = req.body;
      const user = await userModel.findByIdAndUpdate(
        decoded.id,
        { username, email, phone, profilePic },
        { new: true }
      ).select("username email role phone profilePic");

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
});



router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
    }).json({ message: "Logged out" });
});

module.exports = router;