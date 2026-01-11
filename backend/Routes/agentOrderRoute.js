const express = require("express");
const router = express.Router();
const Order = require("../Models/orderModel");
const { verifyToken, isAgent } = require("../middleware/auth");

router.get("/orders", verifyToken, isAgent, async (req, res) => {
  try {
    const agentId = req.user.id;
    const orders = await Order.find({ agent: agentId })
      .populate("user", "username email")
      .populate("product", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
});

router.put("/orders/:id/status", verifyToken, isAgent, async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Porosia nuk u gjet" });
    if (order.agent.toString() !== req.user.id)
      return res.status(403).json({ message: "Nuk lejohet" });

    order.status = status;
    if (message) order.message = message;
    await order.save();

    res.json({ message: "Statusi u perditesua me sukses", order });
  } catch (err) {
    res.status(500).json({ message: "Gabim serveri" });
  }
});

module.exports = router;
