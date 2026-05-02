import { QUESTIONS_PROMPT } from "@/service/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Default questions to use as fallback if AI service fails
const DEFAULT_QUESTIONS = [
  {
    "question": "Tell me about your background and experience relevant to this role.",
    "expectedAnswer": "Candidate should describe relevant experience, skills, and achievements."
  },
  {
    "question": "What interests you about this position?",
    "expectedAnswer": "Candidate should express genuine interest and alignment with the role."
  },
  {
    "question": "Describe a challenging project you worked on and how you handled it.",
    "expectedAnswer": "Candidate should demonstrate problem-solving abilities and resilience."
  },
  {
    "question": "How do you stay updated with industry trends and developments?",
    "expectedAnswer": "Candidate should show commitment to continuous learning."
  },
  {
    "question": "What are your strengths and areas for improvement?",
    "expectedAnswer": "Candidate should show self-awareness and growth mindset."
  }
];

export async function POST(req){
    const {jobPosition,jobDescription,duration,type} = await req.json();
    
    // Validate input parameters
    if (!jobPosition || !jobDescription || !duration || !type) {
        return NextResponse.json({
            error: "Missing required parameters",
            message: { content: JSON.stringify(DEFAULT_QUESTIONS) }
        }, { status: 200 });
    }

    const FINAL_PROMPT = QUESTIONS_PROMPT.replaceAll('{{jobTitle}}',jobPosition)
        .replaceAll('{{jobDescription}}',jobDescription)
        .replaceAll('{{duration}}',duration)
        .replaceAll('{{type}}',type);

    console.log("Generating questions for:", jobPosition);

    // Set timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 15000)
    );

    try{ 
        // Check if API key is available
        if (!process.env.OPENROUTER_API_KEY) {
            console.warn("OpenRouter API key not found, using fallback questions");
            return NextResponse.json({
                message: { content: JSON.stringify(DEFAULT_QUESTIONS) }
            });
        }

        const openai = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        // Race against timeout
        const completionPromise = openai.chat.completions.create({
            model: 'google/gemma-3-12b-it:free',
            messages: [
                {
                    role: 'user',
                    content: FINAL_PROMPT,
                },
            ],
        });

        const completion = await Promise.race([completionPromise, timeoutPromise]);
        console.log("Raw OpenRouter response:", JSON.stringify(completion.choices[0]));
        if (!completion.choices[0]?.message?.content) {
            return NextResponse.json({ message: { content: JSON.stringify(DEFAULT_QUESTIONS) } }, { status: 200 });
        }
        return NextResponse.json({message: completion.choices[0].message});
    }
    catch(e){
        console.error("AI service error:", e);
        return NextResponse.json({
            error: e.message,
            message: { content: JSON.stringify(DEFAULT_QUESTIONS) }
        });
    }
}
"// cache bust" 
