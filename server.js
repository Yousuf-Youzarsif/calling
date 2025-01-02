const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// WebSocket connection setup
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

// Serve static files (if needed)
app.use(express.static("public")); // Or wherever your static files are stored

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
