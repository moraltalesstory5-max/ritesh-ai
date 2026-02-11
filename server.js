import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

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
            { role: "system", content: "You are Ritesh AI, friendly Hinglish assistant." },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on", PORT));
