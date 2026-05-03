import React from 'react'
import DashboardProvider from './provider';
import AppSidebar from './_component/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

function DashboardLayout({ children }) {
  return (
    <SidebarProvider style={{ '--sidebar-width': '260px' }}>
      <DashboardProvider>
        <AppSidebar />
        <SidebarInset className="flex-1 min-w-0">
          {children}
        </SidebarInset>
      </DashboardProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout;
