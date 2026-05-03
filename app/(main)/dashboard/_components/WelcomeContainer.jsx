"use client";
import React from "react";
import { useUser } from "@/app/provider";
import Image from "next/image";
import { Coins } from "lucide-react";

function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl flex justify-between items-center w-full">
      <div>
        <h2 className="text-lg font-bold">Welcome back, {user?.name}</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          AI Driven Interview Assistant
        </p>
        <div className="flex items-center gap-1.5 mt-3">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-700">
            {user?.credits ?? 0} credits remaining
          </span>
        </div>
      </div>
      {user?.picture && (
        <Image
          src={user.picture}
          width={64}
          height={64}
          alt="Profile"
          className="rounded-full"
        />
      )}
    </div>
  );
}

export default WelcomeContainer;
