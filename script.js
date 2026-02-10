const chatBox = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function addLine(cls, text) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMsg() {
  const msg = input.value.trim();
  if (!msg) return;

  addLine("me", "You: " + msg);
  input.value = "";
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      addLine("err", "AI: " + (data?.reply || ("Server error " + res.status)));
    } else {
      addLine("ai", "AI: " + (data?.reply || "No reply"));
    }
  } catch (e) {
    // YE real network error hai (jab request server tak pahunchi hi nahi)
    addLine("err", "AI: Network/Server error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Send";
  }
}

btn.addEventListener("click", sendMsg);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMsg();
});
