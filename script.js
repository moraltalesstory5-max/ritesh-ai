const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function addLine(cls, text) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMsg() {
  const message = input.value.trim();
  if (!message) return;

  addLine("me", "You: " + message);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    addLine("ai", "AI: " + (data.reply || "No reply"));
  } catch (e) {
    addLine("ai", "AI: Network error");
  }
}

btn.addEventListener("click", sendMsg);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMsg();
});
