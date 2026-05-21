const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    // Send back to sender as "You"
    socket.emit("chat message", { msg, isSelf: true });
    // Send to others as "Stranger"
    socket.broadcast.emit("chat message", { msg, isSelf: false });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
