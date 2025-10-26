"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/app/provider";
import supabase from "@/service/supabaseClient";
import { Button } from "@/components/ui/button";
import { Send, Link, Eye, CheckCircle, Search } from "lucide-react";

export default function AllInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user?.email) return;
    
    supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user.email)
      .order("created_at", { ascending: false })
      .then(({ data }) => setInterviews(data || []));
  }, [user?.email, loading]);

  const filtered = interviews.filter(i => 
    i.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyLink = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/interview/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendEmail = (interview) => {
    const link = `${window.location.origin}/interview/${interview.interview_id || interview.id}`;
    window.open(`https://mail.google.com/mail/?view=cm&su=Interview - ${interview.jobPosition}&body=${link}`);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold mb-4">All Interviews ({interviews.length})</h1>
      
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 py-2 border rounded"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((interview) => (
          <div key={interview.id} className="bg-white border rounded p-4">
            <h3 className="font-semibold mb-2">{interview.jobPosition}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {interview.jobDescription?.substring(0, 100)}...
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {interview.duration} • {new Date(interview.created_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => sendEmail(interview)}>
                <Send className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => copyLink(interview.interview_id || interview.id)}>
                {copiedId === (interview.interview_id || interview.id) ? 
                  <CheckCircle className="h-3 w-3 text-green-600" /> : 
                  <Link className="h-3 w-3" />
                }
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}