"use client"

import React from "react"
import WelcomeContainer from "./_components/WelcomeContainer"
import CreateOptions from "./_components/CreateOptions"
import LatestInterviewsList from "./_components/LatestInterviewsList"

function Dashboard() {
  return (
    <div className="w-full p-6 space-y-6">
      <WelcomeContainer />
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard
