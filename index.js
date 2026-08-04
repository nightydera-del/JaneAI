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
  try {
    const message = req.body.message;

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
You are Jane.

You are a guest staying at the player's cabin.
You are a little scared of the player at first, but you are friendly.
You talk naturally and stay in character.

Player says:
${message}

Reply as Jane:
`;

    const result = await model.generateContent(prompt);

    res.json({
      reply: result.response.text()
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Jane could not answer."
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Jane AI running");
});
