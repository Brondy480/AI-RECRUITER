import React from 'react'
import DashboardProvider from './provider';
import AppSidebar from './_component/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

function DashboardLayout({children}) {
  return (
    <div>
    <SidebarProvider>
      <DashboardProvider>
        <div className='flex w-full'>
          <AppSidebar/>
          <div className='flex-1 min-w-0 overflow-auto'>
            {children}
          </div>
        </div>
      </DashboardProvider>
    </SidebarProvider>
    </div>
  )
}

export default DashboardLayout;
