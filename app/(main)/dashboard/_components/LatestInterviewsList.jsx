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
  CheckCircle
} from "lucide-react";

export default function LatestInterviewsList() {
  const [interviewsList, setInterviewsList] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(null); // For email modal
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user?.email) return;
    if (hasLoadedOnce) return; // ⭐ Only load once per session

    const GetInterviewList = async () => {
      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("userEmail", user.email)
        .order("created_at", { ascending: false });

      if (error) return console.error("Error fetching interviews:", error);

      console.log("Fetched interviews:", data);
      setInterviewsList(data || []);
      setHasLoadedOnce(true); // ⭐ Mark as loaded
    };

    GetInterviewList();
  }, [user?.email, loading, hasLoadedOnce]); // ⭐ Include hasLoadedOnce

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
      setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const sendInterviewEmail = (interview) => {
    const interviewLink = `${window.location.origin}/interview/${interview.interview_id || interview.id}`;
    
    // Show email options modal instead of direct mailto
    setShowEmailOptions({
      interview,
      link: interviewLink,
      subject: `Interview Invitation - ${interview.jobPosition}`,
      body: `Hi,

I'd like to invite you to participate in an interview for the ${interview.jobPosition} position.

Duration: ${interview.duration || 'Not specified'}

Please click the link below to start the interview:
${interviewLink}

Best regards`
    });
  };

  const openEmailService = (service, emailData) => {
    const { subject, body } = emailData;
    
    switch(service) {
      case 'gmail':
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        break;
      case 'outlook':
        const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(outlookUrl, '_blank');
        break;
      case 'yahoo':
        const yahooUrl = `https://compose.mail.yahoo.com/?to=&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(yahooUrl, '_blank');
        break;
      case 'default':
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        break;
    }
    
    setShowEmailOptions(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview Dashboard
            </h1>
            <p className="text-gray-600">
              Manage and review your created interviews
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-700">
              {interviewsList.length} Interview{interviewsList.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {interviewsList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <Video className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No interviews yet
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start by creating your first interview to practice and improve your skills.
              It's quick and easy to get started!
            </p>
            <Button size="lg" className="px-8">
              <Send className="mr-2 h-5 w-5" />
              Create Your First Interview
            </Button>
          </div>
        </div>
      ) : (
        /* Interviews Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviewsList.map((interview, index) => (
            <div
              key={interview.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="p-6">
                {/* Header with Position */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Interview #{index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {interview.jobPosition || "Position Not Specified"}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {formatDescription(interview.jobDescription)}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{interview.duration || "No duration"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(interview.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 group-hover:bg-blue-700 transition-colors"
                    onClick={() => sendInterviewEmail(interview)}
                    title="Send interview via email"
                  >
                    <Send className="mr-2 h-4 w-4" />
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
              </div>

              {/* Bottom accent bar */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {interviewsList.length > 0 && (
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {interviewsList.length}
              </div>
              <div className="text-sm text-gray-600">Total Interviews</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(interviewsList.map(i => i.jobPosition)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Positions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {interviewsList.filter(i => 
                  new Date(i.created_at) > new Date(Date.now() - 7*24*60*60*1000)
                ).length}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      )}

      {/* Email Service Modal */}
      {showEmailOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Choose Email Service</h3>
            <p className="text-gray-600 mb-6">
              Select how you'd like to send the interview invitation:
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => openEmailService('gmail', showEmailOptions)}
                className="w-full flex items-center justify-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold">
                  G
                </div>
                <span className="font-medium">Gmail</span>
              </button>
              
              <button
                onClick={() => openEmailService('outlook', showEmailOptions)}
                className="w-full flex items-center justify-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                  O
                </div>
                <span className="font-medium">Outlook</span>
              </button>
              
              <button
                onClick={() => openEmailService('yahoo', showEmailOptions)}
                className="w-full flex items-center justify-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <span className="font-medium">Yahoo Mail</span>
              </button>
              
              <button
                onClick={() => openEmailService('default', showEmailOptions)}
                className="w-full flex items-center justify-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Send className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Default Email App</span>
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(showEmailOptions.link);
                  alert('Interview link copied to clipboard!');
                  setShowEmailOptions(null);
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Or just copy the interview link
              </button>
            </div>
            
            <button
              onClick={() => setShowEmailOptions(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}