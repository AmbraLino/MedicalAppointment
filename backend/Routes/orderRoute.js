const express = require("express");
const router = express.Router();
const orderModel = require("../Models/orderModel");
const User = require("../Models/userModel");
const { verifyToken, isAgent } = require("../middleware/auth");

const getAgentId = async () => {
  const agent = await User.findOne({ role: "agent" });
  return agent ? agent._id : null;
};


router.post("/create", verifyToken, async (req, res) => {
  try {
    const { productId, date, time, message } = req.body;

    // find agent automatically
    const agentId = await getAgentId();
    if (!agentId)
      return res.status(500).json({ message: "No agent found in the system." });

    const newOrder = new orderModel({
      product: productId,
      user: req.user ? req.user._id : null,
      agent: agentId,
      date,
      time,
      message: message || "",
    });

    await newOrder.save();
    res.status(200).json(newOrder);
  } catch (err) {
    res.status(500).json({
      message: "Error creating reservation",
      error: err.message,
    });
  }
});


router.get("/all", verifyToken, isAgent, async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("product")
      .populate("user", "username email")
      .populate("agent", "username email");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .populate("product", "name")
      .populate("agent", "username email");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error loading reservations" });
  }
});

router.patch("/confirm/:id", verifyToken, isAgent, async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status: "Pranuar", agent: req.user._id },
      { new: true }
    );

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error confirming reservation" });
  }
});

module.exports = router;
