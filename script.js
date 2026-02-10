async function send(textFromMic = null) {
  const input = document.getElementById("input");
  const message = textFromMic || input.value;

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();
  document.getElementById("reply").innerText = data.reply;

  speak(data.reply);
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "hi-IN";
  speechSynthesis.speak(speech);
}

function startMic() {
  const rec = new webkitSpeechRecognition();
  rec.lang = "hi-IN";
  rec.onresult = e => send(e.results[0][0].transcript);
  rec.start();
}