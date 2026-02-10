import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// __dirname fix for ES module
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// 👉 PUBLIC FOLDER SERVE KARO
app.use(express.static(path.join(__dirname, "public")));

// 👉 HOME ROUTE (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 👉 CHAT API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, a friendly Hinglish AI assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    res.json({ reply: "Ritesh boss, kuch error aa gaya 😅" });
  }
});

// 👉 PORT (Railway)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Ritesh AI live on port", PORT);
});
