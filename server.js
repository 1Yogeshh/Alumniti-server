const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const databaseconnection = require("./config/db.js");
const cookieParser = require("cookie-parser");
const router = require("./routes/userroutes.js");
const http = require("http");
const { initializeSocket } = require("./socket"); // Import socket setup

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(express.urlencoded({ extended: true }));
databaseconnection();
app.use(
  cors({
    origin: ["https://alumniti-app.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", router);

// Initialize Socket.IO
initializeSocket(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("*", (req, res, next) => {
  res.status(200).json({ message: "bad request" });
});
