const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://wheepupchat.netlify.app"
];
app.use(cors({ origin: allowedOrigins }));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: allowedOrigins } });

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema
const messageSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", async (socket) => {
  console.log("A user connected");

  // Load last 50 messages from MongoDB
  const history = await Message.find()
    .sort({ timestamp: -1 })   // newest first
    .limit(50)                 // only last 50
    .sort({ timestamp: 1 });   // reorder oldest → newest

  history.forEach(msg => {
    socket.emit("chat message", { msg: msg.text, isSelf: false });
  });

  // Save new messages
  socket.on("chat message", async (msg) => {
    await Message.create({ text: msg, timestamp: Date.now() });
    socket.emit("chat message", { msg, isSelf: true });
    socket.broadcast.emit("chat message", { msg, isSelf: false });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const history = await Message.find()
  .sort({ timestamp: -1 })   // newest first
  .limit(50)                 // only last 50
  .sort({ timestamp: 1 });   // then reorder oldest → newest

  socket.on("chat message", async (msg) => {
  await Message.create({ text: msg });

  // Keep only the last 200 messages in DB
  const count = await Message.countDocuments();
  if (count > 200) {
    const oldest = await Message.find().sort({ timestamp: 1 }).limit(count - 200);
    const idsToDelete = oldest.map(m => m._id);
    await Message.deleteMany({ _id: { $in: idsToDelete } });
  }

  socket.emit("chat message", { msg, isSelf: true });
  socket.broadcast.emit("chat message", { msg, isSelf: false });
});

