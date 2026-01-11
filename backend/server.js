
const express = require("express") ;
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const userApp = require("./Routes/userRoute");
const contactApp = require("./Routes/contactRoute");
const adminApp = require("./Routes/adminRoute");
const agentApp = require("./Routes/agentRoute");
const productApp = require("./Routes/productRoute");
const orderApp = require("./Routes/orderRoute"); 
const agentOrderRoute = require("./Routes/agentOrderRoute");
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "This will be secret",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use("/Images", express.static(path.join(__dirname, "Images")));

app.use("/user", userApp);
app.use("/contact", contactApp);
app.use("/admin", adminApp);
// app.use("/agent", agentApp);
app.use("/product", productApp);
app.use("/order", orderApp);
app.use("/agent", agentOrderRoute);

mongoose.connect(
  "mongodb+srv://MedicalSystem:2E8MxSqfXmAN2WNR@medicalcluster.hs25uwx.mongodb.net/?appName=MedicalCluster"
)
.then(() => console.log("DB connected"))
.catch((err) => console.log("DB connection error:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

