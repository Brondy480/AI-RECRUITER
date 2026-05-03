"use client"
import { InterviewDataContext } from '@/Context/InterviewDataContext'
import { Phone, Timer } from 'lucide-react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Mic } from 'lucide-react'
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner';
import axios from 'axios';
import { getVapiInstance, destroyVapiInstance } from "@/app/interview/[interview_id]/start/vapiSingleton";

function StartInterview() {
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    const [activeUser, setActiveUser] = useState(false);
    const [conversation, setConversation] = useState();
    const [vapi] = useState(() => getVapiInstance()); // Use singleton
    const conversationRef = useRef([]);

    // Setup all event listeners once
    useEffect(() => {
        // Error handler
        const handleError = (err) => {
            console.error("Vapi error:", err);
            console.error("Error details:", JSON.stringify(err, null, 2));
            toast.error("Interview error: " + (err?.message || "Unknown error"));
        };

        // Call events
        const handleCallStart = () => {
            console.log("✅ Call started successfully");
            toast.success("Call started");
        };

        const handleCallEnd = () => {
            console.log("❌ Call ended");
            toast.info("Call ended");
            GenerateFeedback();
        };

        // Add ejection handler to see why it's ending
        const handleEjection = (ejectionData) => {
            console.error("🚨 EJECTION DETECTED:", ejectionData);
            console.error("Ejection reason:", ejectionData?.reason);
            console.error("Full ejection data:", JSON.stringify(ejectionData, null, 2));
            toast.error(`Call ejected: ${ejectionData?.reason || 'Unknown reason'}`);
        };

        // Speech events
        const handleSpeechStart = () => {
            console.log("🎤 Speech started");
            setActiveUser(false); // AI is speaking
        };

        const handleSpeechEnd = () => {
            console.log("🔇 Speech ended");
            setActiveUser(true); // User's turn
        };

        // Message events
        const handleMessage = (message) => {
            console.log("📨 Message received:", message);
            if (message?.conversation) {
                setConversation(message.conversation);
                conversationRef.current = message.conversation;
            }
        };

        const handleEvent = (e) => {
            console.log("📢 Vapi event:", e.type || e);
            if (e.type === 'error' || e.error) {
                console.error("Event error details:", e);
            }
        };

        // Attach all listeners
        vapi.on("error", handleError);
        vapi.on("call-start", handleCallStart);
        vapi.on("call-end", handleCallEnd);
        vapi.on("ejection", handleEjection); // Added ejection listener
        vapi.on("speech-start", handleSpeechStart);
        vapi.on("speech-end", handleSpeechEnd);
        vapi.on("message", handleMessage);
        vapi.on("event", handleEvent);

        console.log("🎧 All Vapi event listeners attached");

        // Cleanup function
        return () => {
            console.log("🧹 Cleaning up Vapi listeners");
            vapi.removeListener("error", handleError);
            vapi.removeListener("call-start", handleCallStart);
            vapi.removeListener("call-end", handleCallEnd);
            vapi.removeListener("ejection", handleEjection);
            vapi.removeListener("speech-start", handleSpeechStart);
            vapi.removeListener("speech-end", handleSpeechEnd);
            vapi.removeListener("message", handleMessage);
            vapi.removeListener("event", handleEvent);
        };
    }, []); // Only run once on mount

    // Start call when interviewInfo is available
    useEffect(() => {
        if (interviewInfo) {
            console.log("Interview info available, starting call...");
            startCall();
        }
    }, [interviewInfo]); // Re-run when interviewInfo changes

    const startCall = () => {
        // Build question list
        let questionList = "";
        if (interviewInfo?.interviewData?.questionList) {
            interviewInfo.interviewData.questionList.forEach((item) => {
                questionList += item?.question + ", ";
            });
        }

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
            model: {
                provider: "openrouter",
                model: "google/gemma-3-12b-it:free",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are
the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
✅ Be friendly, engaging, and witty
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level
✅ Ensure the interview remains focused on ${interviewInfo?.interviewData?.jobPosition}
`.trim(),
                    },
                ],
            },
        };

        try {
            console.log("Starting Vapi with options:", assistantOptions);
            vapi.start(assistantOptions);
            console.log("Interview started ✅");
        } catch (err) {
            console.error("Failed to start Vapi:", err);
            toast.error("Failed to start interview");
        }
    };

    const stopInterview = () => {
        console.log("Stopping interview...");
        vapi.stop();
        toast.info("Interview stopped");
    };

    // Generate AI feedback
    const GenerateFeedback = async () => {
        if (!conversationRef.current || conversationRef.current.length === 0) {
            console.log("No conversation to generate feedback from");
            return;
        }

        try {
            console.log("Generating feedback for conversation:", conversationRef.current);
            const result = await axios.post('/api/ai-feedback', {
                conversation: conversationRef.current
            });
            
            console.log("Feedback result:", result?.data);
            
            if (result?.data?.content) {
                const Content = result.data.content;
                const FINAL_CONTENT = Content.replace(/```json/g, '').replace(/```/g, '');
                console.log("Final feedback:", FINAL_CONTENT);
                
                // TODO: Save to database
                toast.success("Feedback generated successfully!");
            }
            
        } catch (error) {
            console.error("Error generating feedback:", error);
            toast.error("Failed to generate feedback");
        }
    };

    return (
        <div className='p-20 lg:px-4 xl:px-56'>
            <h2 className='font-bold text-xl flex justify-between'>
                AI INTERVIEW SESSION
                <span className='flex items-center gap-2'>
                    <Timer />
                    00:00:00
                </span>
            </h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                {/* AI Avatar */}
                <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center relative'>
                    {activeUser && (
                        <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                    )}
                    <Image 
                        src={'/ai.jpg'} 
                        alt='AI Recruiter'
                        width={150} 
                        height={150}
                        className='w-[150px] h-[150px] object-cover rounded-full z-10'
                    />
                    <h2 className='font-semibold z-10'>NK RECRUITER</h2>
                    {!activeUser && (
                        <p className='text-sm text-gray-500 z-10'>Speaking...</p>
                    )}
                </div>

                {/* User Avatar */}
                <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
                    <div className='relative'>
                        {!activeUser && (
                            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                        )}
                        <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-6 text-center z-10 relative'>
                            {interviewInfo?.userName?.[0] || 'U'}
                        </h2>
                    </div>
                    <h2 className='font-semibold'>{interviewInfo?.userName || 'User'}</h2>
                    {activeUser && (
                        <p className='text-sm text-gray-500'>Your turn to speak...</p>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className='flex items-center gap-5 justify-center mt-5'>
                <Mic className='h-12 w-10 p-3 bg-gray-300 text-white rounded-full cursor-pointer hover:bg-gray-400 transition' />
                <AlertConfirmation stopInterview={stopInterview}>
                    <Phone className='h-12 w-10 p-3 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition' />
                </AlertConfirmation>
            </div>

            <h2 className='mt-5 text-gray-500 text-center text-sm'>
                Interview is in progress...
            </h2>
        </div>
    );
}

export default StartInterview;