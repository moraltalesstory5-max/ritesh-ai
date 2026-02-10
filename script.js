const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function addLine(text) {
  const div = document.createElement("div");
  div.textContent = text;
  chatBox.appendChild(div);
}

sendBtn.onclick = async () => {
  const msg = input.value.trim();
  if (!msg) return;

  addLine("You: " + msg);
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",                 // 🔴 MUST be POST
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: msg                  // 🔴 MUST be message
      })
    });

    const data = await res.json();

    if (data.reply) {
      addLine("AI: " + data.reply);
    } else {
      addLine("AI: reply empty aaya 😕");
    }

  } catch (err) {
    addLine("AI: Network error");
    console.error(err);
  }
};
