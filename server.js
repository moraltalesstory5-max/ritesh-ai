const express = require("express");
const fetch = require("node-fetch");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// root route
app.get("/", (req, res) => {
  res.send("Ritesh AI is running 🚀");
});

// chat API (POST only)
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

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
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
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

    if (!data.choices) {
      console.log(data);
      return res.json({ reply: "AI se reply nahi aaya 😕" });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.json({ reply
