const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch"); // ✅ works on all Node versions

const app = express();
app.use(express.json());

// ✅ static serve (public folder exists ho to)
app.use(express.static(path.join(__dirname, "public")));

// ✅ find index.html (public OR root)
function findIndex() {
  const candidates = [
    path.join(__dirname, "public", "index.html"),
    path.join(__dirname, "index.html")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ✅ Home page (UI)
app.get("/", (req, res) => {
  const indexPath = findIndex();
  if (!indexPath) return res.status(404).send("index.html not found");
  return res.sendFile(indexPath);
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) return res.json({ reply: "Message empty hai 😅" });

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a fast, friendly Hindi + Hinglish AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "AI se reply nahi aaya 😕";

    return res.json({ reply });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return res.json({ reply: "Server/Network error 😭" });
  }
});

// ✅ Railway needs PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Ritesh AI live on port:", PORT);
});
