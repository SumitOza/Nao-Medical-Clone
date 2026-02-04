import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Format the conversation for the AI
    const conversationText = messages.map((m: any) => 
      `${m.sender.toUpperCase()}: ${m.originalText}`
    ).join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. The Medical Scribe Prompt
    const prompt = `You are an expert medical scribe. Summarize the following doctor-patient conversation. 
    Format your response clearly with these headers:
    - 🤒 Chief Complaint
    - 💊 Symptoms Identified
    - 📋 Action Plan
    
    Conversation:
    ${conversationText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ summary: response.text() });
    
  } catch (error) {
    return NextResponse.json({ error: "Summary Failed" }, { status: 500 });
  }
}