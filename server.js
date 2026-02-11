[11:48 PM, 2/11/2026] Ritesh Yaduvanshi 😎: const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch"); // ✅ works on all Node versions

const app = express();
app.use(express.json());

// ✅ static serve (public folder exists ho to)
app.use(express.static(path.join(__dirname, "public")));

// ✅ find index.html (public OR root)
function findIndex() {
  const candidates = [
    path.join(__dirname, "public", "index.html"),
    path.join(__dirname, "index.html")
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ✅ Home page (UI)
app.get("/", (req, res) => {
  const indexPath = findIndex();
  if (!indexPath) return res.status(404).send("index.html not found");
  return res.sendFile(indexPath…
[11:53 PM, 2/11/2026] Ritesh Yaduvanshi 😎: import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(express.json());

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// ✅ Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Open UI on "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Chat API
app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").trim();

    if (!userMessage) return res.json({ reply: "Message empty hai 😅" });

    if (!process.env.OPENAI_API_KEY) {
      return res.json({ reply: "OPENAI_API_KEY missing hai Railway Env me 😕" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ THIS LINE FIXES YOUR CRASH
        "Authorization": Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Ritesh, friendly Hindi+Hinglish assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OpenAI error:", data);
      return res.json({ reply: "OpenAI API error 😕 (check server logs)" });
    }

    const reply = data?.choices?.[0]?.message?.content || "Reply nahi aaya 😕";
    return res.json({ reply });
  } catch (err) {
    console.error("Server crash:", err);
    return res.json({ reply: "Ritesh boss, server crash ho gaya 😭" });
  }
});

// ✅ Railway uses PORT env
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Ritesh AI live on port:", PORT));
