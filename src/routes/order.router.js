const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Your order model

// Save order
router.post("/", async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // Validate request
    if (!userId || !items || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Save the order in the database
    const newOrder = new Order({ userId, items, total });
    await newOrder.save();

    res.status(200).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    console.error("Error saving order:", err.message);
    res.status(500).json({ message: "Failed to save order" });
  }
});

router.get("/:userId", async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).json({ orders });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders." });
    }
  });
  

module.exports = router;
