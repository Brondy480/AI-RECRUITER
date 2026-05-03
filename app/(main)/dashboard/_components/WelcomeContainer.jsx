"use client";
import React from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
import { Coins, User } from "lucide-react";

function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {user?.picture ? (
          <Image
            src={user.picture}
            width={56}
            height={56}
            alt="Profile"
            className="rounded-full border-2 border-gray-200 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-gray-500" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            AI-Driven Interview Assistant
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 text-center shrink-0">
        <Coins className="w-5 h-5 text-amber-500 mx-auto mb-1" />
        <div className="text-2xl font-bold text-gray-900">{user?.credits ?? 0}</div>
        <div className="text-xs text-gray-500">Credits</div>
      </div>
    </div>
  );
}

export default WelcomeContainer;
