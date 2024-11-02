import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("[TRANSCRIPTION_REQUEST] Starting transcription");
    
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const language = formData.get("language") as string;

    if (!file) {
      console.log("[TRANSCRIPTION_ERROR] Missing file");
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    console.log("[TRANSCRIPTION_REQUEST] Processing audio file", { language });
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language,
      prompt: `This is a medical conversation that may include symptoms, conditions, or healthcare-related terms. 
              The speech may contain medical terminology and patient descriptions of their health conditions.
              Maintain accuracy of medical terms and numbers.`,
      response_format: "text",
    });

    console.log("[TRANSCRIPTION_SUCCESS] Audio processed successfully");
    return NextResponse.json({ transcription: response });
  } catch (error) {
    console.error("[TRANSCRIPTION_ERROR] Detailed error:", {
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
