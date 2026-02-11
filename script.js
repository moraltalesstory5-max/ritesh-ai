const input = document.getElementById("msgInput");
const btn = document.getElementById("sendBtn");
const chat = document.getElementById("chat");

btn.onclick = async () => {
  const msg = input.value;
  chat.innerHTML += <p><b>You:</b> ${msg}</p>;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    chat.innerHTML += <p><b>AI:</b> ${data.reply}</p>;
  } catch (e) {
    chat.innerHTML += <p><b>AI:</b> Network error</p>;
  }
};
