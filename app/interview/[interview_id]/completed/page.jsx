"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

function InterviewComplete() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Success Icon */}
      <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-2xl shadow-md max-w-lg text-center">
        <CheckCircle2 className="text-green-500 w-20 h-20 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-800">
          Interview Completed 🎉
        </h1>
        <p className="text-gray-600">
          Thank you for completing the interview. Our AI recruiter has generated
          feedback for you. You will be contacted soon with further updates.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Home
          </button>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-gray-500 text-sm">
        Powered by <span className="font-semibold">NK Recruiter</span>
      </p>
    </div>
  );
}

export default InterviewComplete;

