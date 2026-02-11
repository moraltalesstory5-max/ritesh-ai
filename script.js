const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function addLine(label, text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = <span class="${label === "You" ? "you" : "ai"}">${label}:</span> ${text};
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addLine("You", message);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    addLine("AI", data.reply || "No reply");
  } catch (e) {
    addLine("AI", "Server/Network error");
  }
}

btn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
