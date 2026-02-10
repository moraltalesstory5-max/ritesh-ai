import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// middleware
app.use(express.json());

// serve public folder
app.use(express.static(path.join(__dirname, "public")));

// health
app.get("/health", (req, res) => {
  res.send("OK");
});

// serve UI at "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${process.env.OPENAI_API_KEY},
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Ritesh, a friendly Hindi + Hinglish assistant. Reply short, smart and human-like. Start every reply with 'Ritesh boss,'",
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    // If OpenAI returns error (billing/key/model)
    if (!response.ok) {
      console.log("OpenAI error:", data);
      return res.json({
        reply: OpenAI error: ${data?.error?.message || "unknown"},
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.log("OpenAI bad response:", data);
      return res.json({ reply: "AI se reply nahi aaya 😕" });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.json({ reply: "Server error aa gaya 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Running on port", PORT));
