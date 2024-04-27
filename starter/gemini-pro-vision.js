import dotenv from 'dotenv';
import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString('base64'),
            mimeType
        }
    }
}

async function run() {
    const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
    
    const prompt = "What's in the photo?";

    const imageParts = [fileToGenerativePart("./starter/bread.png", "image/png")];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();