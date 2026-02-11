async function send() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;

  chat.innerHTML += <p><b>You:</b> ${text}</p>;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    chat.innerHTML += <p><b>AI:</b> ${data.reply}</p>;
  } catch (e) {
    chat.innerHTML += <p><b>AI:</b> Network error</p>;
  }
}
