"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/provider";
import supabase from "@/service/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Video,
  Clock,
  Calendar,
  Briefcase,
  Send,
  Eye,
  Link,
  Users,
  CheckCircle,
  BarChart2,
} from "lucide-react";

export default function LatestInterviewsList() {
  const [interviewsList, setInterviewsList] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(null);
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;
    if (hasLoadedOnce) return;

    const GetInterviewList = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user.email)
        .order("created_at", { ascending: false });

      if (error) return console.error("Error fetching interviews:", error);

      console.log("Fetched interviews:", data);
      setInterviewsList(data || []);
      setHasLoadedOnce(true);
    };

    GetInterviewList();
  }, [user?.email, loading, hasLoadedOnce]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDescription = (description, maxLength = 120) => {
    if (!description) return "No description available";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const copyInterviewLink = async (interviewId) => {
    const link = `${window.location.origin}/interview/${interviewId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(interviewId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const sendInterviewEmail = (interview) => {
    const interviewLink = `${window.location.origin}/interview/${interview.interview_id || interview.id}`;
    setShowEmailOptions({
      interview,
      link: interviewLink,
      subject: `Interview Invitation - ${interview.jobPosition}`,
      body: `Hi,\n\nI'd like to invite you to participate in an interview for the ${interview.jobPosition} position.\n\nDuration: ${interview.duration || "Not specified"}\n\nPlease click the link below to start the interview:\n${interviewLink}\n\nBest regards`,
    });
  };

  const openEmailService = (service, emailData) => {
    const { subject, body } = emailData;
    switch (service) {
      case "gmail":
        window.open(
          `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          "_blank"
        );
        break;
      case "outlook":
        window.open(
          `https://outlook.live.com/mail/0/deeplink/compose?to=&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          "_blank"
        );
        break;
      case "yahoo":
        window.open(
          `https://compose.mail.yahoo.com/?to=&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          "_blank"
        );
        break;
      case "default":
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
    }
    setShowEmailOptions(null);
  };

  const thisMonthCount = interviewsList.filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="text-gray-500 text-sm">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{interviewsList.length}</div>
            <div className="text-xs text-gray-500">Total Interviews</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-lg">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{thisMonthCount}</div>
            <div className="text-xs text-gray-500">This Month</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-lg">
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(interviewsList.map((i) => i.jobPosition)).size}
            </div>
            <div className="text-xs text-gray-500">Unique Positions</div>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Recent Interviews
        </h3>
      </div>

      {/* Empty state */}
      {interviewsList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="bg-blue-50 p-5 rounded-full w-fit mx-auto mb-4">
            <Video className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No interviews yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Create your first interview to start evaluating candidates with AI.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviewsList.map((interview, index) => (
            <div
              key={interview.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col"
            >
              <div className="p-5 flex-1">
                {/* Position header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-blue-100 p-1.5 rounded-md">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {interview.jobPosition || "Position Not Specified"}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {formatDescription(interview.jobDescription)}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{interview.duration || "No duration"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(interview.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-4 flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => sendInterviewEmail(interview)}
                  title="Send interview via email"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Send
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  onClick={() => copyInterviewLink(interview.interview_id || interview.id)}
                  title="Copy interview link"
                >
                  {copiedId === (interview.interview_id || interview.id) ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Link className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-b-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Email service modal */}
      {showEmailOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-1">Send Interview Invitation</h3>
            <p className="text-gray-500 text-sm mb-5">Choose your email service:</p>

            <div className="space-y-2">
              {[
                { key: "gmail", label: "Gmail", color: "bg-red-500" },
                { key: "outlook", label: "Outlook", color: "bg-blue-600" },
                { key: "yahoo", label: "Yahoo Mail", color: "bg-purple-600" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => openEmailService(key, showEmailOptions)}
                  className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 ${color} rounded flex items-center justify-center text-white text-sm font-bold`}>
                    {label[0]}
                  </div>
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
              <button
                onClick={() => openEmailService("default", showEmailOptions)}
                className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5 text-gray-500 ml-1.5" />
                <span className="font-medium text-sm">Default Email App</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showEmailOptions.link);
                  alert("Interview link copied to clipboard!");
                  setShowEmailOptions(null);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Or just copy the interview link
              </button>
            </div>

            <button
              onClick={() => setShowEmailOptions(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
