"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionList from "./_components/QuestionList";
import InterviewLink from "./_components/InterviewLink";
import { toast } from "sonner";
import { useUser } from "@/app/provider";

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
    // ✅ IMPORTANT: wait for auth resolution
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

  console.log("AUTH USER:", user);





  return (
    <div className="mt-5 px-10 md:px-24 lg:px-44 xl:px-56">

      <div className="flex gap-5 items-center mb-5">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => router.back()}
        />
        <h2 className="font-bold text-2xl">Create new interview</h2>
      </div>

      <Progress value={step * 33.33} className="mb-6" />

      {step === 1 && (
        <FormContainer
          formData={formData}
          onHandleInputChange={onHandleInputChange}
          onNext={onGoToNext}
        />
      )}

      {step === 2 && (
        <QuestionList
          formData={formData}
          onCreateLink={onCreateLink}
        />
      )}

      {step === 3 && interviewId && (
        <InterviewLink
          interview_id={interviewId}
          formData={formData}
        />
      )}
    </div>
  );
}

export default CreateInterview;
