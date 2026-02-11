const express = require("express");
const path = require("path");

const app = express();

// ===== middleware =====
app.use(express.json());

// public folder serve
app.use(express.static(path.join(__dirname, "public")));

// ✅ UI page (root)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ health check
app.get("/health", (req, res) => {
  res.send("Ritesh AI is running 🚀");
});

// ===== CHAT API =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ reply: "Message empty hai 😅" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    // Node 18+ me fetch built-in hota hai
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
              "You are Ritesh, a friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like.",
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OpenAI error:", data);
      return res
        .status(500)
        .json({ reply: "OpenAI API error aa gaya 😕" });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.log("OpenAI response:", data);
      return res.status(500).json({ reply: "AI se valid reply nahi aaya 😕" });
    }

    res.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ reply: "Server error aa gaya 😭" });
  }
});

// ===== Railway PORT =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI live on port:", PORT);
});
