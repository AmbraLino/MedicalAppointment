require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const rateLimit = require("express-rate-limit");

const userApp = require("./Routes/userRoute");
const contactApp = require("./Routes/contactRoute");
const adminApp = require("./Routes/adminRoute");
const bookingRoute = require('./Routes/bookingRoute');
const doctorRoutes = require("./Routes/doctorRoute");
const departmentRoutes = require("./Routes/departmentRoute");

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Too many requests from this IP! Please try again in a minute."
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(limiter);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use("/Images", express.static(path.join(__dirname, "Images")));

app.use("/user", userApp);
app.use("/contact", contactApp);
app.use("/admin", adminApp);
app.use("/booking", bookingRoute);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB connected"))
.catch((err) => console.log("DB connection error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));