import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai'; 


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    
    const prompt = "What is divinity in two words?";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();