async function send() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chat");

  const text = input.value;
  chat.innerHTML += <p>You: ${text}</p>;
  input.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();
  chat.innerHTML += <p>AI: ${data.reply}</p>;
}
