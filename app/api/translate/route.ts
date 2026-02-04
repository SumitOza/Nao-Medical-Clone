import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { text, targetRole } = await req.json();
    
    // Safety check
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ translation: "Error: No API Key found." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const targetLang = targetRole === 'doctor' ? 'English' : 'Spanish';
    
    const prompt = `Translate this medical text to ${targetLang}. Return ONLY the translation. Text: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translation = response.text();

    return NextResponse.json({ translation });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ translation: "Translation Error" }, { status: 500 });
  }
}