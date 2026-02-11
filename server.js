import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// middleware
app.use(express.json());
app.use(express.static("public"));

// test route
app.get("/", (req, res) => {
  res.send("Ritesh AI server running 🚀");
});

// chat route
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    if (!OPENAI_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing ❌" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": Bearer ${OPENAI_KEY}
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are Ritesh, a friendly Hindi + Hinglish AI assistant."
            },
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.log("OpenAI error:", data);
      return res.json({ reply: "AI reply nahi aaya 😕" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Server crash ho gaya 😭" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
