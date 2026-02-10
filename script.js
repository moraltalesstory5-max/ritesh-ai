const chat = document.getElementById("chat");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = msgInput.value.trim();
  if (!message) return;

  chat.innerHTML += <div class="me"><b>You:</b> ${escapeHtml(message)}</div>;
  msgInput.value = "";
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chat.innerHTML += <div class="ai"><b>AI:</b> ${escapeHtml(data.reply || "No reply")}</div>;
    chat.scrollTop = chat.scrollHeight;
  } catch (err) {
    console.error(err);
    chat.innerHTML += <div class="ai"><b>AI:</b> Network error</div>;
    chat.scrollTop = chat.scrollHeight;
  }
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
