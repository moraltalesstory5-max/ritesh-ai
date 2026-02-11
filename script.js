const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const msgInput = document.getElementById("msgInput");

function addMsg(who, text) {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = <span class="${who === "You" ? "you" : "ai"}">${who}:</span> ${text};
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // ✅ refresh रोकता है

  const message = msgInput.value.trim();
  if (!message) return;

  addMsg("You", message);
  msgInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    addMsg("AI", data.reply || "No reply 😕");
  } catch (err) {
    addMsg("AI", "Server/Network error");
  }
});
