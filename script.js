const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

function add(text) {
  const p = document.createElement("p");
  p.textContent = text;
  chat.appendChild(p);
}

async function sendMessage() {
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

    const contentType = res.headers.get("content-type") || "";

    // अगर JSON नहीं आया तो text दिखा देंगे
    if (!contentType.includes("application/json")) {
      const txt = await res.text();
      add(AI: Non-JSON response (${res.status}) -> ${txt.slice(0, 120)});
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      add(AI: Error (${res.status}) -> ${data?.reply || data?.error || "Unknown error"});
      return;
    }

    add("AI: " + (data.reply || "No reply"));
  } catch (e) {
    console.log(e);
    add("AI: Network/Server down (fetch failed)");
  }
}

btn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
