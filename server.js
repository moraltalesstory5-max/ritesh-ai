import express from "express";

const app = express();

// ===== middleware =====
app.use(express.json());
app.use(express.static("public"));

// ===== root (UI) =====
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

// ===== chat API =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message?.trim();

    if (!userMessage) {
      return res.status(400).json({ reply: "Message empty hai 😅" });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return res.status(500).json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    // IMPORTANT: backticks + Bearer string correct
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${key},
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

    // अगर OpenAI error आया तो उसे भी दिखा देंगे (frontend ko clear reason मिले)
    if (!response.ok) {
      const msg = data?.error?.message || "OpenAI API error";
      return res.status(500).json({ reply: OpenAI Error: ${msg} });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return res.status(500).json({ reply: "AI se valid reply nahi aaya 😕" });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ reply: "Server crash / error aa gaya 😭" });
  }
});

// ===== Railway PORT =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("🚀 Ritesh AI live on port:", PORT);
});
