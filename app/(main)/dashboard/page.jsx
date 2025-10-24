"use client"

import React from "react"
import AppSidebar from "../_component/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import WelcomeContainer from "./_components/WelcomeContainer"
import CreateOptions from "./_components/CreateOptions"
import LatestInterviewsList from "./_components/LatestInterviewsList"

function Dashboard({ children }) {
  return (
    <SidebarProvider>
      {/* Sidebar always rendered */}
      <AppSidebar />
      { /*<SidebarTrigger />*/}

      {/* Main content area */}
      <div className="mt-10">
 
     
        <h2 className=" ml-10 my-3 font-bold text-2xl">Dashboard</h2>
        <CreateOptions/>

        <LatestInterviewsList/>

        <div className="p-2">
         
        </div>

        {/* Page children */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
