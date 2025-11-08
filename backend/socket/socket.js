// backend/socket/socket.js
import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // adjust if frontend runs elsewhere
    credentials: true,
  },
});

export const userSocketMap = {};

// connection handler
io.on("connection", (socket) => {
  // client should connect with: io(url, { query: { userId } }) or new URLSearchParams
  const userId = socket.handshake.query?.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // broadcast online users (optional)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export everything so controllers can import io
export { app, server, io };
