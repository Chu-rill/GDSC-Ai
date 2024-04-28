// import "./style.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "./secrets.js";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

const text = document.querySelector("text");

// ...

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "hello i would like to know what you can do" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = "who discovered gravity";

  // Use streaming with multi-turn conversations (like chat)
  const result = await chat.sendMessageStream(msg);
  const response = await result.response;
  const text = response.text();

  // For multi-turn conversations (like chat)
  const history = await chat.getHistory();
  const msgContent = { role: "user", parts: [{ text: msg }] };
  const contents = [...history, msgContent];
  const { totalTokens } = await model.countTokens({ contents });

  console.log(text);
  console.log(totalTokens);
}

run();

text.addEventListener("input", function () {
  text.style.height = "auto";
  text.style.height = text.scrollHeight + "px";
});
