import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/health", (req, res) => res.send("ok"));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message || "";

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "OPENAI_API_KEY missing in Railway Variables." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.OPENAI_API_KEY},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, a fast friendly Hindi+Hinglish AI assistant. Reply short and helpful." },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No reply";

    return res.json({ reply });
  } catch (err) {
    return res.status(500).json({ reply: "Ritesh boss, server error aa gaya. Phir try karo." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Ritesh AI running on", PORT));
