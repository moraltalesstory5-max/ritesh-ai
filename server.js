import express from "express";
import fetch from "node-fetch";

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// health check (important for Railway)
app.get("/", (req, res) => {
  res.send("Ritesh AI is running 🚀");
});

// chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Ritesh, a fast, friendly Hindi + Hinglish AI assistant. Reply short, smart and human-like."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.log(data);
      return res.json({ reply: "API se response nahi aaya 😕" });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.json({
      reply: "Ritesh boss, server crash ho gaya 😭"
    });
  }
});

// Railway PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Ritesh AI live on port:", PORT);
});
