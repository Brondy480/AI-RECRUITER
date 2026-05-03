"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import InterviewLink from "./_components/InterviewLink";
import { toast } from "sonner";
import { useUser } from "@/app/provider";

const STEPS = [
  { number: 1, label: "Configure" },
  { number: 2, label: "Review Questions" },
  { number: 3, label: "Share Link" },
];

function CreateInterview() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [step, setStep] = useState(1);
  const [interviewId, setInterviewId] = useState(null);

  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDescription: "",
    duration: "",
    type: "",
  });

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGoToNext = () => {
    if (loading) {
      toast("Checking authentication...");
      return;
    }

    if (!user) {
      toast.error("Please log in to create an interview");
      return;
    }

    if (Number(user.credits) <= 0) {
      toast.error("You don't have enough credits.");
      return;
    }

    if (
      !formData.jobPosition ||
      !formData.jobDescription ||
      !formData.duration ||
      !formData.type
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setStep(2);
  };

  const onCreateLink = (id) => {
    setInterviewId(id);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 py-5 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeft
            onClick={() => router.push("/dashboard")}
            className="cursor-pointer w-5 h-5 text-gray-500 hover:text-gray-800 transition-colors"
          />
          <div>
            <h1 className="text-xl font-semibold">Create interview</h1>
            <p className="text-sm text-gray-400">
              Set up an AI-powered interview for your candidate
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-gray-600">
            {user?.credits ?? 0} credits
          </span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.number}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step >= s.number
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s.number}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    step >= s.number ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 transition-colors ${
                    step > s.number ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-6 py-6 max-w-7xl mx-auto">
        {/* Left column — always visible */}
        <div className="lg:col-span-3">
          <FormContainer
            formData={formData}
            onHandleInputChange={onHandleInputChange}
            onNext={onGoToNext}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="h-full min-h-[420px] bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-center p-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Questions appear here
              </p>
              <p className="text-xs text-gray-400 max-w-[180px]">
                Fill in the form and click Generate to continue
              </p>
            </div>
          )}

          {step === 2 && (
            <QuestionList formData={formData} onCreateLink={onCreateLink} />
          )}

          {step === 3 && interviewId && (
            <InterviewLink interview_id={interviewId} formData={formData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateInterview;
