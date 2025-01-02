const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Express App Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Client Connection Handle
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Offer Handle
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  // Answer Handle
  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  // ICE Candidate Handle
  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
  });

  // Disconnect Handle
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Server Start
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});
