import { FEEDBACK_PROMPT } from "@/service/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation } = await req.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    console.log(conversation);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b",
      messages: [
        {
          role: "user",
          content: FINAL_PROMPT,
        },
      ],
    });

    return NextResponse.json({
      message: completion.choices[0].message,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e.message });
  }
}
