import express from "express";
import fetch from "node-fetch";

const app = express();

// ===== middleware =====
app.use(express.json());
app.use(express.static("public"));

// ===== health check =====
app.get("/", (req, res) => {
  res.send("Ritesh AI server running 🚀");
});

// ===== CHAT API (POST) =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

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
        // ✅ IMPORTANT FIX: backticks use honge
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Ritesh, a friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OpenAI error:", data);
      return res.json({ reply: OpenAI Error: ${data?.error?.message || "Unknown"} });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.log("OpenAI response:", data);
      return res.json({ reply: "AI se valid reply nahi aaya 😕" });
    }

    res.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error aa gaya 😭" });
  }
});

// ===== Railway PORT =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI live on port:", PORT);
});
