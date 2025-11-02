// backend/socket/socket.js
import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  // broadcast list of online userIds
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket events can be handled here if needed
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
