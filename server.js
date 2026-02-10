import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ===== FIX __dirname (ESM) =====
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== HOME → LOAD CHAT UI =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== CHAT API (MATCHES index.html) =====
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                "You are Ritesh, a fast, friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.log(data);
      return res.json({ reply: "AI se reply nahi aaya 😕" });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.json({
      reply: "Ritesh boss, server side error aa gaya 😭"
    });
  }
});

// ===== RAILWAY PORT =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI live on port:", PORT);
});
