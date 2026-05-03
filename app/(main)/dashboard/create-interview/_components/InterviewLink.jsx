import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Mail, Plus, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function InterviewLink({ interview_id, formData }) {
  const url =
    process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview_id;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center gap-5">
      {/* Success icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-emerald-500" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Interview ready!</h2>
        <p className="text-sm text-gray-400 mt-1">
          {formData?.jobPosition || "Your interview"} · Share the link below
        </p>
      </div>

      {/* Link box */}
      <div className="w-full text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Interview Link
        </p>
        <div className="flex gap-2">
          <Input
            defaultValue={url}
            disabled
            className="flex-1 text-xs bg-gray-50 border-gray-200"
          />
          <Button onClick={onCopyLink} className="shrink-0">
            Copy
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Valid for 30 days</p>
      </div>

      <hr className="w-full border-gray-100" />

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="bg-gray-50 rounded-xl p-3 text-left">
          <p className="text-xs text-gray-400 mb-0.5">Duration</p>
          <p className="text-sm font-semibold">{formData?.duration} min</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-left">
          <p className="text-xs text-gray-400 mb-0.5">Type</p>
          <p className="text-sm font-semibold capitalize">{formData?.type}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-left">
          <p className="text-xs text-gray-400 mb-0.5">Status</p>
          <p className="text-sm font-semibold text-emerald-600">Ready</p>
        </div>
      </div>

      {/* Share buttons */}
      <div className="w-full text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Share Via
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 text-sm">
            <Mail className="w-4 h-4" /> Email
          </Button>
          <Button variant="outline" className="flex-1 gap-2 text-sm">
            <Send className="w-4 h-4" /> WhatsApp
          </Button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex w-full gap-3 pt-1">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/create-interview" className="flex-1">
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" /> New interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
