const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  chatBox.innerHTML += <p><b>You:</b> ${message}</p>;
  userInput.value = "";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    chatBox.innerHTML += <p><b>AI:</b> ${data.reply}</p>;
  } catch (err) {
    console.error(err);
    chatBox.innerHTML += <p><b>AI:</b> Network error</p>;
  }
}
