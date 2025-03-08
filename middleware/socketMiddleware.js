// socket/socketMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }
    socket.user = user; // attach user info to socket
    next();
  } catch (error) {
    console.error("Socket middleware error:", error);
    next(new Error("Authentication error"));
  }
};

module.exports = { socketAuthMiddleware };