import express from "express";
import multer from "multer";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ------------------------------------------------------
// Extract Text From PDF / DOCX
// ------------------------------------------------------
async function extractTextFromFile(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  // ----- PDF -----
  if (mimetype === "application/pdf" || ext === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse.default(buffer);
    return data.text;
  }

  // ----- DOCX / DOC -----
  if (mimetype.includes("officedocument") || ext === ".docx" || ext === ".doc") {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // Fallback
  return (await fs.readFile(filePath, "utf8")).toString();
}

// ------------------------------------------------------
// Gemini API Call
// ------------------------------------------------------
async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1500
    }
  };

  const response = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" }
  });

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    JSON.stringify(response.data);

  return text;
}

// ------------------------------------------------------
// Resume Analyzer Route
// ------------------------------------------------------
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No resume uploaded");

  try {
    const text = await extractTextFromFile(file.path, file.mimetype);
    await fs.unlink(file.path).catch(() => {});

    // Strict JSON system prompt for Gemini
    const systemPrompt = `You are an expert resume analyzer. Respond ONLY with JSON.
Follow this schema exactly:

{
  "skills": { "React": 0-100, "Node.js": 0-100, ... },
  "progress": { "Jan": 0-100, "Feb": 0-100, "Mar": 0-100, "Apr": 0-100, "May": 0-100, "Jun": 0-100 },
  "missing_keywords": ["string", ...],
  "suggested_improvements": ["string", ...],
  "overall_score": 0-100,
  "rank_percentile": 0-100,
  "extracted_experience_years": number | null,
  "raw_text_snippet": "string"
}

Rules:
- Always include ALL fields exactly as above.
- All numbers must be integers (0-100).
- If a value cannot be determined, estimate conservatively.
- DO NOT return anything except valid JSON.

--- PROGRESS GENERATION LOGIC (IMPORTANT) ---
The "progress" field must reflect the candidate’s real skill growth based on:
• new technologies and tools learned while working in production,
• new responsibilities taken on in each job role,
• introduction to advanced concepts (e.g., AWS, EC2, S3, Socket.io, BullMQ, Nginx, PM2, real-time architecture),
• increased scope (frontend → backend → deployment → cloud),
• ability to handle more complex tasks over time,
• transition from trainee → intern → developer → full stack.

How to generate the 6-month progress curve:
1. Identify which months (or time periods) correspond to the most learning in the resume.
2. Detect where the candidate grew significantly (e.g., learned cloud deployment, app releases, IoT encryption systems, real-time systems).
3. Convert this growth into a smooth 6-month score progression.
4. The curve should show realistic improvement, e.g.:

• Slow growth when learning basic UI/React
• Faster growth when learning backend, AWS, real-time systems
• Stable but higher growth when handling production deployments and cloud infra

5. Make sure the 6 values increase realistically and stay between 0–100.

Example pattern:
Jan: 62 → Feb: 65 → Mar: 70 → Apr: 76 → May: 82 → Jun: 88

But always infer values *from the resume’s actual experience* — not randomly.

--- END OF PROGRESS LOGIC ---
`;

    const fullPrompt = `${systemPrompt}\n\n--- RESUME TEXT START ---\n${text}\n--- RESUME TEXT END ---`;

    const raw = await callGemini(fullPrompt);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Gemini returned non-JSON output.");
      parsed = JSON.parse(match[0]);
    }

    return res.json({ ok: true, data: parsed });

  } catch (err) {
    console.error("Gemini error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ------------------------------------------------------
// Start Server
// ------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Gemini Resume Analyzer running on port ${PORT}`);
});
