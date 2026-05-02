"use client";

import React from "react";

function FormContainer({ formData, onHandleInputChange, onNext }) {

  const handleNext = () => {
    onNext(); // parent handles validation & step change
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      {/* Job Position */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Job Position</label>
        <input
          type="text"
          className="w-full border rounded-lg p-3"
          value={formData.jobPosition}
          onChange={(e) =>
            onHandleInputChange("jobPosition", e.target.value)
          }
        />
      </div>

      {/* Job Description */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Job Description</label>
        <textarea
          className="w-full border rounded-lg p-3"
          value={formData.jobDescription}
          onChange={(e) =>
            onHandleInputChange("jobDescription", e.target.value)
          }
        />
      </div>

      {/* Duration */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Interview Duration</label>
        <select
          className="w-full border rounded-lg p-3"
          value={formData.duration}
          onChange={(e) =>
            onHandleInputChange("duration", e.target.value)
          }
        >
          <option value="">Select duration</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
        </select>
      </div>

      {/* Type */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Interview Type</label>
        <select
          className="w-full border rounded-lg p-3"
          value={formData.type}
          onChange={(e) =>
            onHandleInputChange("type", e.target.value)
          }
        >
          <option value="">Select type</option>
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <button
        onClick={handleNext}
        className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
      >
        Next
      </button>
    </div>
  );
}

export default FormContainer;
