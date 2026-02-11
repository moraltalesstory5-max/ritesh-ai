const chatDiv = document.getElementById("chat");
const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");

btn.onclick = async () => {
  const msg = input.value.trim();
  if (!msg) return;

  chatDiv.innerHTML += <p><b>You:</b> ${msg}</p>;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    chatDiv.innerHTML += <p><b>AI:</b> ${data.reply}</p>;
  } catch (e) {
    chatDiv.innerHTML += <p><b>AI:</b> Network error</p>;
  }
