import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Ritesh AI is running 🚀");
});

// Optional: GET /chat ko bhi handle karo
app.get("/chat", (req, res) => {
  res.status(405).json({ reply: "Use POST /chat with JSON: { message: '...' }" });
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;

    if (!userMessage) return res.status(400).json({ reply: "Message empty hai 😅" });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ reply: "OPENAI_API_KEY missing hai ❌" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, friendly Hindi + Hinglish assistant. Reply short, smart and human-like." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json().catch(() => null);

    // अगर OpenAI ने error दिया
    if (!response.ok) {
      console.log("OpenAI ERROR status:", response.status, data);
      return res.status(response.status).json({
        reply: OpenAI error (${response.status}): ${data?.error?.message || "Unknown"}
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.log("OpenAI BAD DATA:", data);
      return res.status(500).json({ reply: "OpenAI se reply nahi aaya 😕" });
    }

    return res.json({ reply });
  } catch (err) {
    console.error("SERVER CRASH:", err);
    return res.status(500).json({ reply: "Server error aa gaya 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Ritesh AI live on port:", PORT));
