import React from 'react'
import DashboardProvider from './provider';
import AppSidebar from './_component/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="w-full min-h-screen bg-gray-50">
            {children}
          </div>
        </SidebarInset>
      </DashboardProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout;
