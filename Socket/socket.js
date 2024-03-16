const { Server } = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

let userSocketMap = {};

exports.getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected");

  const userId = socket.handshake.query.userId;
  console.log("a user connected");
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send events to all connected clients.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be both on client and server side.
  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

exports.server = server;
exports.io = io;
exports.app = app;

