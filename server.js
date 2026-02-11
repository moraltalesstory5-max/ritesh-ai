const express = require("express");

const app = express();

// Middleware
app.use(express.json());

// ✅ PUBLIC FOLDER (UI)
app.use(express.static("public"));

// ❌ "/" route MAT likho
// UI index.html automatic serve hoga

// ✅ HEALTH CHECK (Railway ke liye)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ CHAT API
app.post("/chat", async (req, res) => {
  try {
    const msg = req.body?.message;

    if (!msg) {
      return res.json({ reply: "Message empty hai 😅" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: msg
      })
    });

    const data = await response.json();

    let reply =
      data.output_text ||
      "AI se reply nahi aaya 😕";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error 😭" });
  }
});

// ✅ PORT (MOST IMPORTANT)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
