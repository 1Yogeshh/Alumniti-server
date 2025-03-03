// socket/socketController.js
const Message = require("../models/Message");
const User = require("../models/User");

module.exports = {
  async handleSendMessage(socket, data) {
    // Expects data: { recipientId, content }
    try {
      const { recipientId, content } = data;
      const sender = socket.user;

      // Verify that recipient exists and belongs to the same college
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return socket.emit("error", { message: "Recipient not found" });
      }
      if (sender.college !== recipient.college) {
        return socket.emit("error", {
          message: "Cannot message user from a different college",
        });
      }

      // Create and save the message
      const newMessage = new Message({
        senderId: sender._id,
        recipientId,
        content,
      });
      const savedMessage = await newMessage.save();

      // Emit the message to the recipient's room and to the sender
      socket.to(recipientId.toString()).emit("receiveMessage", savedMessage);
      socket.emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  },

  handleTyping(socket, data) {
    const { recipientId } = data;
    if (recipientId) {
      socket
        .to(recipientId.toString())
        .emit("typing", { senderId: socket.user._id });
    }
  },

  handleStopTyping(socket, data) {
    const { recipientId } = data;
    if (recipientId) {
      socket
        .to(recipientId.toString())
        .emit("stopTyping", { senderId: socket.user._id });
    }
  },

  async handleFetchMessages(socket, data) {
    // Expects data: { recipientId }
    try {
      const { recipientId } = data;
      const senderId = socket.user._id;
      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      }).sort({ timestamp: 1 });

      // Send the previous messages to the client
      socket.emit("previousMessages", messages);
    } catch (error) {
      console.error("Error in handleFetchMessages:", error);
      socket.emit("error", { message: "Failed to fetch messages" });
    }
  },
};
