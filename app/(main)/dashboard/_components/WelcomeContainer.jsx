"use client";
import React from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
import { Coins, LayoutDashboard } from "lucide-react";

function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 flex items-center justify-between gap-4 text-white">
      <div className="flex items-center gap-4 min-w-0">
        {user?.picture ? (
          <Image
            src={user.picture}
            width={56}
            height={56}
            alt="Profile"
            className="rounded-full border-2 border-white/40 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-bold truncate">
            Welcome back, {user?.name}
          </h2>
          <p className="text-blue-100 text-sm mt-0.5">
            AI-Driven Interview Assistant
          </p>
        </div>
      </div>

      <div className="bg-white/20 rounded-xl px-5 py-3 text-center shrink-0">
        <Coins className="w-5 h-5 text-amber-300 mx-auto mb-1" />
        <div className="text-2xl font-bold">{user?.credits ?? 0}</div>
        <div className="text-xs text-blue-100">Credits</div>
      </div>
    </div>
  );
}

export default WelcomeContainer;
