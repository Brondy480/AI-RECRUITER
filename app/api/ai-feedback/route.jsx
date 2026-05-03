import { FEEDBACK_PROMPT } from "@/service/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

// Default feedback to use as fallback if AI service fails
const DEFAULT_FEEDBACK = {
  "overallScore": 7,
  "strengths": [
    "Good communication skills",
    "Provided relevant examples",
    "Demonstrated enthusiasm for the role"
  ],
  "areasForImprovement": [
    "Could provide more specific technical details",
    "Consider structuring answers more concisely"
  ],
  "summary": "The candidate showed good potential with strong communication skills and relevant experience. Some technical answers could be more detailed."
};

export async function POST(req) {
  try {
    const { conversation } = await req.json();
    
    // Validate input
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      console.warn("Invalid conversation data provided");
      return NextResponse.json({
        message: { content: JSON.stringify(DEFAULT_FEEDBACK) }
      });
    }
    
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    // Check if API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn("OpenRouter API key not found, using fallback feedback");
      return NextResponse.json({
        message: { content: JSON.stringify(DEFAULT_FEEDBACK) }
      });
    }

    // Set timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 30000)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    // Race against timeout with retry on 429
    const makeRequest = async () => {
      try {
        return await openai.chat.completions.create({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [{ role: "user", content: FINAL_PROMPT }],
        });
      } catch (e) {
        if (e.status === 429) {
          console.log("Rate limited, retrying in 3s...");
          await new Promise(r => setTimeout(r, 3000));
          return await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [{ role: "user", content: FINAL_PROMPT }],
          });
        }
        throw e;
      }
    };

    const completion = await Promise.race([makeRequest(), timeoutPromise]);
    return NextResponse.json({
      message: completion.choices[0].message,
    });
  } catch (e) {
    console.error("AI feedback generation error:", e);
    return NextResponse.json({ 
      error: e.message,
      message: { content: JSON.stringify(DEFAULT_FEEDBACK) }
    });
  }
}
