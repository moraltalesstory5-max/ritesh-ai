const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("msgInput");
const statusEl = document.getElementById("status");

function addMsg(text, cls) {
  const div = document.createElement("div");
  div.className = msg ${cls};
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // IMPORTANT: page reload rokta hai

  const message = input.value.trim();
  if (!message) return;

  addMsg(message, "me");
  input.value = "";
  statusEl.textContent = "Typing...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (!res.ok) {
      addMsg(Error: ${res.status}, "ai");
      statusEl.textContent = "";
      return;
    }

    addMsg(data.reply || "No reply", "ai");
    statusEl.textContent = "";
  } catch (err) {
    console.error(err);
    addMsg("Network/Server error 😕", "ai");
    statusEl.textContent = "";
  }
});
