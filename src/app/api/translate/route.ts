import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const validateInput = (text: string, sourceLanguage: string, targetLanguage: string) => {
  const allowedLanguages = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ko', 'ar'];
  
  if (!text) {
    console.log('Empty text received');
    return false;
  }
  
  if (text.length > 5000) {
    console.log('Text too long:', text.length);
    return false;
  }
  
  if (!allowedLanguages.includes(sourceLanguage)) {
    console.log('Invalid source language:', sourceLanguage);
    return false;
  }
  
  if (!allowedLanguages.includes(targetLanguage)) {
    console.log('Invalid target language:', targetLanguage);
    return false;
  }
  
  return true;
};

export async function POST(req: Request) {
  try {
    console.log('[TRANSLATION_REQUEST] Starting new translation request');

    if (req.method !== 'POST') {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json();
    const { text, sourceLanguage, targetLanguage } = body;

    console.log('[TRANSLATION_REQUEST] Request details:', {
      sourceLanguage,
      targetLanguage,
      textLength: text?.length,
      textSample: text?.substring(0, 100) // Log first 100 chars for debugging
    });

    if (!validateInput(text, sourceLanguage, targetLanguage)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a professional medical translator. Translate the following text from {input_language} to {output_language}. 
        Preserve any medical terminology and maintain the original meaning. 
        If the input appears to be in a different language than specified, translate from the detected language.`
      ],
      ["human", "{text}"],
    ]);

    console.log('[TRANSLATION_REQUEST] Sending to OpenAI');
    
    const chain = prompt.pipe(chat);
    const response = await chain.invoke({
      input_language: sourceLanguage,
      output_language: targetLanguage,
      text: text,
    });

    console.log('[TRANSLATION_SUCCESS] Translation completed');
    
    return NextResponse.json({ translation: response.content });
  } catch (error) {
    console.error("[TRANSLATION_ERROR] Detailed error:", error);
    return NextResponse.json(
      { error: "Translation failed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
