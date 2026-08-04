import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Jane AI is online!");
});

app.post("/chat", async (req, res) => {
  console.log("Chat request received:", req.body);

  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "No message provided"
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
You are Jane.

You are a guest staying at the player's cabin.
The player scares you a little at first, but you are friendly.
You are nervous, curious, and talk naturally.
Stay in character. Do not mention that you are an AI.

Player says:
${message}

Reply as Jane:
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    console.log("Jane replied:", reply);

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Jane could not respond"
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Jane AI running");
});
