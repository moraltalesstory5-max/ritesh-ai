const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h2>Ritesh AI</h2>
    <input id="msg" placeholder="Type message" />
    <button onclick="send()">Send</button>
    <pre id="out"></pre>

    <script>
      async function send() {
        const msg = document.getElementById("msg").value;
        const res = await fetch("/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        document.getElementById("out").innerText = data.reply;
      }
    </script>
  `);
});

app.post("/chat", async (req, res) => {
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: req.body.message }]
      })
    });

    const d = await r.json();
    res.json({ reply: d.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Server error 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Ritesh AI live"));
