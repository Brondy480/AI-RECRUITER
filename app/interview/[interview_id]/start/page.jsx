"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { InterviewDataContext } from "@/Context/InterviewDataContext";
import { Phone, Timer, Mic, Loader2 } from "lucide-react"; // 👈 Import Loader2
import { getVapiInstance, resetVapiInstance } from "./vapiSingleton";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import supabase from "@/service/supabaseClient";
import { useParams, useRouter } from "next/navigation";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const { interview_id } = useParams();
  const router = useRouter();

  const [vapi, setVapi] = useState(getVapiInstance());
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [callStarted, setCallStarted] = useState(false);
  const [manuallyStopped, setManuallyStopped] = useState(false);
  const [loading, setLoading] = useState(false); // used for feedback generation

  // ---------- VAPI EVENT LISTENERS ---------- 
  useEffect(() => {
    if (!vapi) return;

    const handleError = (err) => {
      console.error("Vapi error:", err);
      toast.error("Interview error: " + (err?.errorMsg || "Unknown error"));
    };

    const handleCallStart = () => {
      console.log("Call started");
      toast("Call started");
      setCallStarted(true);
    };

    const handleCallEnd = () => {
      console.log("Call ended");
      toast("Call ended");
      setCallStarted(false);
    };

    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);

    const handleMessage = (message) => {
      if (message?.conversation) setConversation(message.conversation);
    };

    vapi.on("error", handleError);
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);

    return () => {
      vapi.stop?.();
      vapi.destroy?.();
      vapi.removeAllListeners?.();
    };
  }, [vapi]);

  // ---------- START CALL ----------
  const startCall = async () => {
    if (!vapi || callStarted || manuallyStopped) return;

    resetVapiInstance();
    const newVapi = getVapiInstance();
    setVapi(newVapi);

    await new Promise((res) => setTimeout(res, 500));

    let questionList = "";
    interviewInfo?.interviewData?.questionList?.forEach(
      (item) => (questionList += item?.question + ", ")
    );

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI voice assistant conducting interviews. Ask one question at a time from the following questions: ${questionList}. Summarize and end positively after 5-7 questions.`,
          },
        ],
      },
    };

    try {
      newVapi.start(assistantOptions);
      console.log("Interview started ✅");
      setCallStarted(true);
      setManuallyStopped(false);
    } catch (err) {
      console.error("Failed to start Vapi:", err);
      toast.error("Cannot start interview: " + (err?.message || "Unknown error"));
    }
  };

  // ---------- STOP CALL ----------
  const stopInterview = async () => {
    if (!vapi || !callStarted) return;

    setLoading(true); // show loader
    try {
      vapi.stop?.();
      vapi.destroy?.();
      vapi.removeAllListeners?.();

      toast("Interview manually stopped ✅");
      setCallStarted(false);
      setManuallyStopped(true);

      resetVapiInstance();
      setVapi(getVapiInstance());

      await generateFeedback();
    } catch (err) {
      console.error("Error stopping interview:", err);
    } finally {
      setLoading(false); // hide loader after feedback generation
    }
  };

  // ---------- FEEDBACK GENERATION ----------
 const generateFeedback = async () => {
  if (!conversation?.length) {
    console.log("No conversation to generate feedback from yet");
    return;
  }

  try {
    const result = await axios.post("/api/ai-feedback", { conversation });
    let feedback =
      result?.data?.feedback || result?.data?.message?.content || null;

    if (!feedback) {
      console.error("No feedback found in API response");
      return;
    }

    console.log("Raw Feedback:", feedback);

    // 🛠️ Ensure it's JSON, not a string with ```json
    if (typeof feedback === "string") {
      try {
        // Remove ```json ... ``` wrappers if present
        feedback = feedback.replace(/```json|```/g, "").trim();
        feedback = JSON.parse(feedback);
      } catch (err) {
        console.error("Failed to parse feedback into JSON", err);
      }
    }

    console.log("Final Feedback Object:", feedback);
    toast.success("Feedback generated ✅");

    const { data, error } = await supabase
      .from("interview_feedback")
      .insert([
        {
          username: interviewInfo?.userName,
          useremail: interviewInfo?.userEmail,
          interview_id,
          feedback, // 👈 now stored as real JSON
          recommended: false,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback");
      return;
    }

    console.log("Saved feedback:", data);
    router.replace(`/interview/${interview_id}/completed`);
  } catch (err) {
    console.error("Error generating feedback:", err);
    toast.error("Failed to generate feedback");
  }
};


  return (
    <div className="p-20 lg:px-4 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI INTERVIEW SESSION
        <span className="flex items-center">
          <Timer /> 00:00:00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {/* AI Recruiter */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center relative">
          {activeUser && (
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping" />
          )}
          <Image
            src={"/ai.jpg"}
            alt="logo"
            width={150}
            height={150}
            className="rounded-full object-cover"
          />
          <h2>NK RECRUITER</h2>
        </div>

        {/* Candidate */}
        <div className="bg-white h-[400px] w-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-6 text-center">
              {interviewInfo?.userName?.[0]}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 justify-center">
          <Mic className="h-12 w-10 p-3 bg-gray-300 text-white rounded-full" />
          <AlertConfirmation stopInterview={stopInterview}>
            <Phone className="h-12 w-10 p-3 bg-red-500 rounded-full" />
          </AlertConfirmation>
        </div>
      </div>

      {/* Loader UI when feedback is generating */}
      {loading && (
        <div className="flex flex-col items-center mt-6">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
          <p className="mt-2 text-gray-500">Generating feedback...</p>
        </div>
      )}

      <h2 className="mt-5 text-gray-500 text-center text-sm">
        Interview is in progress..
      </h2>

      {!callStarted && !manuallyStopped && (
        <button
          onClick={startCall}
          className="mt-4 p-3 bg-green-500 text-white rounded"
        >
          Start Interview
        </button>
      )}
    </div>
  );
}

export default StartInterview;
