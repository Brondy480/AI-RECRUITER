import React from 'react'
import DashboardProvider from './provider';
import AppSidebar from './_component/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

function DashboardLayout({children}) {
  return (
    <SidebarProvider>
      <DashboardProvider>
        <div className='flex w-full min-h-screen'>
          <AppSidebar/>
          <div className='flex-1 min-w-0 overflow-auto'>
            {children}
          </div>
        </div>
      </DashboardProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout;
