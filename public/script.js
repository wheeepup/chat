const socket = io(); // auto-connects to localhost:3000

document.getElementById("send").onclick = sendMessage;
document.getElementById("m").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById("m");
  if (input.value.trim() !== "") {
    socket.emit("chat message", input.value);
    input.value = "";
  }
}

socket.on("chat message", (data) => {
  const li = document.createElement("li");
  li.className = "message " + (data.isSelf ? "self" : "other");

  // Avatar
  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = data.isSelf
    ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" // user icon
    : "https://cdn-icons-png.flaticon.com/512/1946/1946406.png"; // stranger icon

  // Bubble
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = (data.isSelf ? "You: " : "Stranger: ") + data.msg;

  li.appendChild(avatar);
  li.appendChild(bubble);

  document.getElementById("messages").appendChild(li);
  document.getElementById("chat-window").scrollTop =
    document.getElementById("chat-window").scrollHeight;
});

// Theme toggle
document.getElementById("toggle-theme").onclick = () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    document.getElementById("toggle-theme").textContent = "☀️";
  } else {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    document.getElementById("toggle-theme").textContent = "🌙";
  }
};

avatar.src = data.isSelf
  ? "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" // user avatar
  : "https://cdn-icons-png.flaticon.com/512/1946/1946406.png"; // stranger avatar


