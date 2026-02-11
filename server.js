const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// ✅ Public folder serve karega (index.html, script.js, etc.)
app.use(express.static("public"));

// ✅ Railway health check alag route pe
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Ritesh AI is healthy 🚀" });
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body && req.body.message ? String(req.body.message) : "").trim();

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY set nahi hai (Railway Variables me add karo) ❌" });
    }

    // ✅ Node 18+ me fetch built-in hota hai
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ❌ Yaha ${} wali bakchodi mat karo. Simple concat best.
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: "You are Ritesh, a fast, friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    // ✅ Error handling
    if (!response.ok) {
      console.log("OPENAI_ERROR:", data);
      return res.json({ reply: "OpenAI error: " + (data.error?.message || "unknown") });
    }

    // ✅ Responses API se text nikalna
    let replyText = "";

    // Many SDKs use output_text helper; raw JSON me output array hota hai
    if (typeof data.output_text === "string" && data.output_text.trim()) {
      replyText = data.output_text.trim();
    } else if (Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c.type === "output_text" && c.text) {
              replyText += c.text;
            }
          }
        }
      }
      replyText = replyText.trim();
    }

    if (!replyText) {
      console.log("NO_TEXT_RESPONSE:", data);
      replyText = "API se reply text nahi mila 😕";
    }

    res.json({ reply: replyText });
  } catch (err) {
    console.error("SERVER_CRASH:", err);
    res.json({ reply: "Ritesh boss, server crash ho gaya 😭" });
  }
});

// ✅ Railway PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Ritesh AI live on port:", PORT);
});
