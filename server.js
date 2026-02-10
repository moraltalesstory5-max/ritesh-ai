import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// serve public folder
app.use(express.static(path.join(__dirname, "public")));

// home route
app.get("/", (req, res) => {
  res.send("Ritesh AI is running 🚀");
});

// chat API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

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
    res.json({ reply: data.choices?.[0]?.message?.content || "No reply 😕" });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Ritesh boss, server error aa gaya 😵" });
  }
});

// port (Railway auto injects PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Ritesh AI live on port", PORT);
});
