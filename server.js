import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ===== fix __dirname for ESM =====
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ===== middleware =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== root (frontend) =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== chat api =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer {process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Ritesh, a friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "AI se reply nahi aaya 😕"
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error aa gaya 😭" });
  }
});

// ===== Railway port =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI live on port", PORT);
});

