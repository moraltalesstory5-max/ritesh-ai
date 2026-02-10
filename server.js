const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Home page serve
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body && req.body.message;

    if (!userMessage) return res.json({ reply: "Message empty hai 😅" });
    if (!process.env.OPENAI_API_KEY) return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, a friendly Hindi + Hinglish AI assistant. Reply short, smart, human-like." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      console.log("OpenAI error:", data);
      return res.status(500).json({ reply: "OpenAI error aa gaya 😕" });
    }

    const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!reply) return res.json({ reply: "AI se reply nahi aaya 😕" });

    res.json({ reply });
  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ reply: "Server crash error 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Ritesh AI live on port:", PORT));
