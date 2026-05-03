"use client";

import React from "react";
import {
  Code2,
  Users,
  Briefcase,
  Brain,
  TrendingUp,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical", icon: Code2 },
  { value: "behavioral", label: "Behavioral", icon: Users },
  { value: "experience", label: "Experience", icon: Briefcase },
  { value: "problem-solving", label: "Problem Solving", icon: Brain },
  { value: "leadership", label: "Leadership", icon: TrendingUp },
  { value: "mixed", label: "Mixed", icon: LayoutGrid },
];

const DURATIONS = [
  { value: "5", label: "5 min", credits: "1 credit" },
  { value: "10", label: "10 min", credits: "2 credits" },
  { value: "15", label: "15 min", credits: "3 credits" },
];

function FormContainer({ formData, onHandleInputChange, onNext }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

      {/* Job Position */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Job Position
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          value={formData.jobPosition}
          onChange={(e) => onHandleInputChange("jobPosition", e.target.value)}
        />
      </div>

      {/* Job Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Job Description
        </label>
        <textarea
          placeholder="Describe the role, responsibilities, and required skills..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
          style={{ minHeight: "120px" }}
          value={formData.jobDescription}
          onChange={(e) =>
            onHandleInputChange("jobDescription", e.target.value)
          }
        />
      </div>

      {/* Interview Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Interview Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {INTERVIEW_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onHandleInputChange("type", value)}
              className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                formData.type === value
                  ? "border-gray-900 bg-gray-50 text-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Duration
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DURATIONS.map(({ value, label, credits }) => (
            <button
              key={value}
              type="button"
              onClick={() => onHandleInputChange("duration", value)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-sm transition-all ${
                formData.duration === value
                  ? "border-gray-900 bg-gray-50 text-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="font-semibold">{label}</span>
              <span className="text-xs text-gray-400">{credits}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-80"
        style={{ backgroundColor: "#111" }}
      >
        <Sparkles className="w-4 h-4" />
        Generate Interview Questions
      </button>
    </div>
  );
}

export default FormContainer;
