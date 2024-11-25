const express = require("express");
const Chat = require("../models/Chat"); // Import Chat model
const router = express.Router();

// Get chat history between two users
router.get("/chats/:userId/:recipientId", async (req, res) => {
  const { userId, recipientId } = req.params;

  try {
    const chats = await Chat.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to load chat history." });
  }
});

module.exports = router;
