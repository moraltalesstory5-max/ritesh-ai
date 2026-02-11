const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// ✅ Try these possible locations (public OR root)
const CANDIDATE_DIRS = [
  path.join(__dirname, "public"),
  __dirname, // root
];

// ✅ find index.html
function findFile(filename) {
  for (const dir of CANDIDATE_DIRS) {
    const p = path.join(dir, filename);
    try {
      // require fs only here to avoid extra clutter
      require("fs").accessSync(p);
      return p;
    } catch (_) {}
  }
  return null;
}

// ✅ serve static from public if exists
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// ✅ Home route => serve index.html wherever it is
app.get("/", (req, res) => {
  const indexPath = findFile("index.html");
  if (!indexPath) return res.status(404).send("index.html not found");
  return res.sendFile(indexPath);
});

// ✅ optional health
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.message;
    if (!userMessage) return res.json({ reply: "Message empty hai 😅" });

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai ❌" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${process.env.OPENAI_API_KEY},
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: userMessage,
      }),
    });

    const data = await response.json();
    const reply = data.output_text || "AI se reply nahi aaya 😕";
    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.json({ reply: "Server/Network error 😭" });
  }
});

// ✅ Railway PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Running on port", PORT));
