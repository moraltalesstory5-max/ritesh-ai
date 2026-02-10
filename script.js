const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function add(text) {
  const p = document.createElement("p");
  p.textContent = text;
  chat.appendChild(p);
}

btn.addEventListener("click", async () => {
  const message = input.value.trim();
  if (!message) return;

  add("You: " + message);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    add("AI: " + (data.reply || "No reply"));
  } catch (e) {
    console.log(e);
    add("AI: Server/Network error");
  }
});
