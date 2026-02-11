import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// required for ES modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// middleware
app.use(express.json());

// serve frontend files from ROOT (important)
app.use(express.static(__dirname));

// home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${process.env.OPENAI_API_KEY}
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Ritesh, a fast, friendly Hindi + Hinglish AI assistant."
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.log(data);
      return res.json({ reply: "API se response nahi aaya 😕" });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error 😭" });
  }
});

// Railway port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Ritesh AI live on port", PORT);
});
