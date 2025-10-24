import React from 'react'
import DashboardProvider from './provider';
import AppSidebar from './_component/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

function DashboardLayout({children}) {
  return (
    <div>
    <SidebarProvider>
  
    <DashboardProvider>
     <AppSidebar/>
    <div className=''>
     {children}
     </div>
    </DashboardProvider>
    </SidebarProvider>
     
    </div>
  )
}

export default DashboardLayout;
