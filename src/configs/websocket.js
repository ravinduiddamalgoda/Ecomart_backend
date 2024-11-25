const WebSocket = require("ws");
const Chat = require("../models/Chat");

const users = new Map(); // Track connected users

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const userId = req.url.split("?userId=")[1];
    users.set(userId, ws);

    ws.on("message", async (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "message") {
          const { recipientId, text } = parsedMessage;

          // Validate recipientId and text
          if (!recipientId || !text.trim()) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message data. Recipient ID and text are required.",
              })
            );
            return;
          }

          // Save message to the database
          const chat = new Chat({ senderId: userId, recipientId, text });
          await chat.save();

          // Send confirmation to the sender
          ws.send(
            JSON.stringify({
              type: "confirmation",
              message: "Message sent successfully.",
              recipientId,
              text,
            })
          );

          console.log("Message saved to database");

          // Deliver message to the recipient if they are connected
          const recipientWs = users.get(recipientId);
          if (recipientWs) {
            recipientWs.send(
              JSON.stringify({
                type: "message",
                senderId: userId,
                text,
              })
            );
          }
        }
      } catch (err) {
        console.error("Error processing message:", err);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Failed to process the message. Please try again.",
          })
        );
      }
    });

    ws.on("close", () => {
      users.delete(userId);
      console.log(`Connection closed for user: ${userId}`);
    });
  });
};

module.exports = { setupWebSocket };
