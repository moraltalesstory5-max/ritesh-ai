import express from "express";
import fetch from "node-fetch";

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// health check
app.get("/", (req, res) => {
  res.send("Ritesh AI server running 🚀");
});

// chat api
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message empty hai" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
                "You are Ritesh, a friendly Hindi + Hinglish AI assistant."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.log(data);
      return res.json({ reply: "AI response error" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

// railway port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
