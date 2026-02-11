import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ===== FIX __dirname =====
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ===== middleware =====
app.use(express.json());
app.use(express.static("public"));

// ===== ROOT → FRONTEND =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== CHAT API =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message empty hai 😅" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "OPENAI_API_KEY missing ❌" });
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
          {
            role: "system",
            content:
              "You are Ritesh boss assistant. Reply in friendly Hindi + Hinglish. Short and human."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.log("OpenAI Error:", data);
      return res.json({ reply: "AI reply nahi de raha 😕" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server crash ho gaya 😭" });
  }
});

// ===== RAILWAY PORT =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI running on port", PORT);
});
