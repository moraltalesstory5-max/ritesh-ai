const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// ✅ Public folder absolute path
app.use(express.static(path.join(__dirname, "public")));

// ✅ Force "/" to load index.html (agar static miss ho jaye to bhi)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Health
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const msg = req.body?.message;
    if (!msg) return res.json({ reply: "Message empty hai 😅" });

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: msg,
      }),
    });

    const data = await response.json();
    const reply = data.output_text || "AI se reply nahi aaya 😕";
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Server error 😭" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Running on", PORT));
