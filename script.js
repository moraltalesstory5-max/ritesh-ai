const chatBox = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function addLine(who, text) {
  const p = document.createElement("p");
  p.innerHTML = <b>${who}:</b> ${text};
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function send() {
  const msg = (input.value || "").trim();
  if (!msg) return;

  addLine("You", msg);
  input.value = "";
  btn.disabled = true;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    addLine("AI", data.reply || "No reply");
  } catch (e) {
    addLine("AI", "Server/Network error");
  } finally {
    btn.disabled = false;
    input.focus();
  }
}

btn.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});
