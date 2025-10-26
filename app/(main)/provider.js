import React from 'react'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import AppSidebar from './_component/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

function DashboardProvider({children}) {
  return (
    <div>
      <WelcomeContainer className="mt-10" />
      {children}
    
    </div>
  )
}

export default DashboardProvider