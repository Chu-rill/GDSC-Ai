import "./style.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_GEMINI_API_KEY } from "./secrets.js";

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);
const imagePreviewPanel = document.getElementById("image-preview");
const fileSelectorEl = document.getElementById("file-select");
const imagePreview = document.getElementById("blah");
const solveBtn = document.getElementById("solveBtn");
const solutionEl = document.getElementById("solution-text");

imagePreviewPanel.addEventListener("click", () => {
  fileSelectorEl.click();
});

fileSelectorEl.addEventListener("change", () => {
  const file = fileSelectorEl.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      imagePreview.src = reader.result;
    };
  }
});

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

// Implement Google Gemini
async function run() {
  // For text-and-images input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "";

  const imageParts = await Promise.all(
    [...fileSelectorEl.files].map(fileToGenerativePart)
  );

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  solutionEl.innerText = text;
}

solveBtn.addEventListener("click", () => {
  run();
});
