"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/service/supabaseClient";
import { useUser } from "@/app/provider";

function ScheduledInterview() {
  const { user, loading } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;
    GetInterviewList();
  }, [user?.email, loading]);

  const GetInterviewList = async () => {
    try {
      const { data, error } = await supabase
        .from("Interviews")
        .select(`
          jobPosition,
          jobDescription,
          duration,
          type,
          interview_id,
          interview_feedback (
            id,
            useremail,
            username,
            feedback,
            recommended,
            created_at
          )
        `)
        .eq("userEmail", user?.email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching interviews:", error);
        setInterviewList([]);
        return;
      }
      setInterviewList(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openCandidates = (interview) => setSelectedInterview(interview);
  const closeModal = () => setSelectedInterview(null);

  const parseFeedback = (fb) => {
    if (!fb) return null;
    if (typeof fb === "object") return fb;
    if (typeof fb === "string") {
      try {
        const cleaned = fb.replace(/```json|```/g, "").trim();
        return JSON.parse(cleaned);
      } catch {
        return fb;
      }
    }
    return fb;
  };

  const renderFeedback = (obj) => {
    if (typeof obj !== "object" || obj === null) return <span>{obj?.toString()}</span>;

    return (
      <table className="w-full text-left text-sm border-collapse my-2">
        <tbody>
          {Object.entries(obj).map(([key, value], idx) => (
            <tr key={key} className={idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}>
              <td className="px-3 py-2 font-medium text-gray-700">{key}</td>
              <td className="px-3 py-2 text-gray-800">
                {typeof value === "object" && value !== null ? renderFeedback(value) : value?.toString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="p-6 md:ml-64 bg-white min-h-screen text-gray-900">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
        Interview List with Feedback
      </h2>

      {interviewList.length === 0 ? (
        <p className="text-gray-500 text-lg">No interviews found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewList.map((interview) => (
            <div
              key={interview.interview_id}
              className="bg-gray-100 shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 flex flex-col border border-gray-200"
            >
              <h3 className="font-bold text-xl mb-2 text-gray-900">
                {interview.jobPosition}
              </h3>
              <p className="text-gray-700 mb-3 line-clamp-3" style={{ maxHeight: 80 }}>
                {interview.jobDescription}
              </p>

              <div className="mt-auto space-y-2">
                <p className="text-sm text-gray-700">Duration: <span className="font-medium">{interview.duration}</span></p>
                <p className="text-sm text-gray-500">Candidates: <span className="font-semibold">{interview.interview_feedback?.length || 0}</span></p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openCandidates(interview)}
                    className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition"
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/interview/${interview.interview_id}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(url);
                        alert("Link copied to clipboard!");
                      } else {
                        prompt("Copy the interview link:", url);
                      }
                    }}
                    className="px-4 py-2 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-50 transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={closeModal}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[85vh] overflow-auto p-6 z-10 text-gray-900">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              {selectedInterview.jobPosition} — Candidates (
              {selectedInterview.interview_feedback?.length || 0})
            </h3>

            {selectedInterview.interview_feedback?.length > 0 ? (
              <div className="space-y-6">
                {selectedInterview.interview_feedback.map((fb) => {
                  const parsed = parseFeedback(fb.feedback);
                  return (
                    <div
                      key={fb.id}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg text-gray-900">
                            {fb.username || fb.useremail || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {fb.useremail || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {fb.created_at ? new Date(fb.created_at).toLocaleString() : ""}
                          </p>
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold ${
                              fb.recommended
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {fb.recommended ? "✅ Recommended" : "❌ Not Recommended"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm">
                        <strong>Feedback:</strong>
                        <div className="mt-2">{renderFeedback(parsed)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-lg">No candidates have participated yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
