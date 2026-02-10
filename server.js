import express from "express";

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Health
app.get("/health", (req, res) => res.send("OK"));

// Root
app.get("/", (req, res) => res.sendFile(process.cwd() + "/public/index.html"));

// Debug: so you can open /chat in browser and see msg
app.get("/chat", (req, res) => {
  res.status(405).send("Use POST /chat with JSON: {\"message\":\"hi\"}");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message?.toString().trim();

    if (!userMessage) return res.status(400).json({ reply: "Message empty hai 😅" });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ reply: "OPENAI_API_KEY missing hai ❌" });

    // Node 18+ me fetch built-in hota hai (Railway Node 22)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${key},
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, friendly Hindi+Hinglish assistant. Reply short, smart and human-like." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = null; }

    if (!r.ok) {
      // yahi se exact reason milega (401/429/billing etc)
      console.log("OpenAI error status:", r.status, text);
      return res.status(500).json({ reply: OpenAI error (${r.status}): ${data?.error?.message || text} });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      console.log("OpenAI bad response:", text);
      return res.status(500).json({ reply: "AI se valid reply nahi aaya 😕" });
    }

    return res.json({ reply });
  } catch (e) {
    console.error("SERVER CRASH:", e);
    return res.status(500).json({ reply: "Server crash ho gaya 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Live on port", PORT));
