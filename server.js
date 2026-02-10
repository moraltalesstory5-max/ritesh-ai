import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ===== dirname fix =====
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ===== middleware =====
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== home =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== chat api =====
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.json({ reply: "Message likho na 🙂" });
    }

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${process.env.OPENAI_API_KEY}
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Ritesh, a friendly Hindi + Hinglish AI. Reply short and human-like."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await openaiRes.json();

    if (!data.choices) {
      console.log("OpenAI error:", data);
      return res.json({ reply: "AI response nahi mila 😕" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server error aa gaya 😭" });
  }
});

// ===== port =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("✅ Ritesh AI running on port", PORT);
});
