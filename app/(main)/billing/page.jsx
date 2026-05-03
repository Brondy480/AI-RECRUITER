"use client";

import React from "react";
import { Coins, Sparkles, Zap, Building2 } from "lucide-react";
import { useUser } from "@/app/provider";
import { toast } from "sonner";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    price: 10,
    icon: Zap,
    description: "Perfect for trying out the platform",
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    credits: 25,
    price: 20,
    icon: Sparkles,
    description: "Best value for growing teams",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 60,
    price: 40,
    icon: Building2,
    description: "For high-volume hiring pipelines",
    popular: false,
  },
];

function BillingPage() {
  const { user } = useUser();

  const onBuyNow = (pkg) => {
    toast("Stripe integration coming soon");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-gray-400 mt-1">
          Purchase credits to run AI-powered interviews
        </p>
      </div>

      {/* Current balance */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between mb-8 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Current Balance
          </p>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold">
              {user?.credits ?? 0}
            </span>
            <span className="text-gray-400 text-sm">credits</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">1 credit = 1 interview</p>
          <p className="text-xs text-gray-400 mt-0.5">Credits never expire</p>
        </div>
      </div>

      {/* Packages */}
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
        Choose a package
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          const costPerInterview = (pkg.price / pkg.credits).toFixed(2);

          return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl border shadow-sm p-6 flex flex-col gap-4 transition-shadow hover:shadow-md ${
                pkg.popular
                  ? "border-gray-900 ring-1 ring-gray-900"
                  : "border-gray-100"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    pkg.popular ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{pkg.name}</p>
                  <p className="text-xs text-gray-400">{pkg.description}</p>
                </div>
              </div>

              {/* Credits + price */}
              <div>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-bold">{pkg.credits}</span>
                  <span className="text-gray-400 text-sm mb-1">credits</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-semibold">${pkg.price}</span>
                  <span className="text-xs text-gray-400">one-time</span>
                </div>
              </div>

              {/* Cost per interview */}
              <div className="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  ${costPerInterview}
                </span>{" "}
                per interview
              </div>

              {/* Buy button */}
              <button
                onClick={() => onBuyNow(pkg)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80 ${
                  pkg.popular
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Buy now
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-gray-400 mt-8">
        Secure payments powered by Stripe · Credits are non-refundable
      </p>
    </div>
  );
}

export default BillingPage;
