import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Add input validation
const validateInput = (text: string, sourceLanguage: string, targetLanguage: string) => {
  const allowedLanguages = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ko', 'ar'];
  
  if (!text || text.length > 5000) return false;  // Limit text length
  if (!allowedLanguages.includes(sourceLanguage)) return false;
  if (!allowedLanguages.includes(targetLanguage)) return false;
  
  return true;
};

// Simple in-memory rate limiting
const WINDOW_SIZE = 60000; // 1 minute
const MAX_REQUESTS = 50;   // 50 requests per minute
const requests: number[] = [];

const isRateLimited = () => {
  const now = Date.now();
  const windowStart = now - WINDOW_SIZE;
  
  // Remove old requests
  while (requests.length > 0 && requests[0] < windowStart) {
    requests.shift();
  }
  
  // Check if limit exceeded
  if (requests.length >= MAX_REQUESTS) {
    return true;
  }
  
  // Add new request
  requests.push(now);
  return false;
};

export async function POST(req: Request) {
  // Check rate limit
  if (isRateLimited()) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    // Add request method validation
    if (req.method !== 'POST') {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json();
    const { text, sourceLanguage, targetLanguage } = body;

    // Validate input
    if (!validateInput(text, sourceLanguage, targetLanguage)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    console.log("[TRANSLATION_REQUEST] Starting translation request");
    
    console.log("[TRANSLATION_REQUEST] Request details:", {
      sourceLanguage,
      targetLanguage,
      textLength: text?.length,
    });

    console.log("[TRANSLATION_REQUEST] Creating OpenAI client");
    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    console.log("[TRANSLATION_REQUEST] Creating prompt");
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a professional medical translator with expertise in healthcare terminology and cultural sensitivity.
        
        Important guidelines for all languages:
        - Maintain medical accuracy and terminology
        - Preserve the tone and urgency level of medical communication
        - Use culturally appropriate language and honorifics
        - Ensure translations are clear and understandable to patients
        - Keep emotional and empathetic elements intact

        Language-specific guidelines:
        For Urdu (ur):
        - Use proper Nastaliq script
        - Use formal medical terms with common explanations when needed
        - Maintain respectful tone with appropriate honorifics

        For Arabic (ar):
        - Use Modern Standard Arabic for medical terms
        - Include dialectal explanations where necessary
        - Right-to-left text formatting

        For Chinese (zh):
        - Use Simplified Chinese characters
        - Include medical terms with their common explanations
        - Maintain appropriate level of formality

        For Spanish (es):
        - Use neutral Spanish for wider understanding
        - Include regional medical term variations if critical
        - Maintain formal but approachable tone

        For Hindi (hi):
        - Use Devanagari script properly
        - Balance formal medical terms with commonly understood phrases
        - Use appropriate honorifics

        For French (fr):
        - Use formal register for medical communication
        - Maintain proper medical terminology
        - Include common terms when necessary

        For English (en):
        - Use clear, plain language
        - Explain medical terms when needed
        - Maintain professional but accessible tone

        Translate the following text from {input_language} to {output_language}.`,
      ],
      ["human", "{text}"],
    ]);

    console.log("[TRANSLATION_REQUEST] Creating chain");
    const chain = prompt.pipe(chat);

    console.log("[TRANSLATION_REQUEST] Invoking translation");
    const response = await chain.invoke({
      input_language: sourceLanguage,
      output_language: targetLanguage,
      text: text,
    });

    console.log("[TRANSLATION_SUCCESS] Translation completed");
    return NextResponse.json({ translation: response.content });
  } catch (error) {
    console.error("[TRANSLATION_ERROR] Detailed error:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
