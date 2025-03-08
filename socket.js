// socket.js
const { Server } = require("socket.io");
const { socketAuthMiddleware } = require("./middleware/socketMiddleware");
const socketController = require("./Controllers/socketController");

let io;
const onlineUsers = new Set();

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });

  // Use authentication middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}, user: ${socket.user.name}`);
    // Add user to the online set and broadcast
    onlineUsers.add(socket.user._id.toString());
    io.emit("updateOnlineUsers", Array.from(onlineUsers));

    // Have the user join a room using their own id
    socket.join(socket.user._id.toString());

    // Socket events for messaging and fetching previous messages
    socket.on("fetchMessages", (data) => {
      socketController.handleFetchMessages(socket, data);
    });

    socket.on("sendMessage", (data) => {
      socketController.handleSendMessage(socket, data);
    });

    socket.on("typing", (data) => {
      socketController.handleTyping(socket, data);
    });

    socket.on("stopTyping", (data) => {
      socketController.handleStopTyping(socket, data);
    });

    // On disconnect, remove from online set and broadcast update
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.user._id.toString());
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getSocketInstance = () => io;

module.exports = { initializeSocket, getSocketInstance };