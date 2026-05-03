import React from 'react'

function DashboardProvider({ children }) {
  return (
    <div className="flex flex-1 w-full">
      {children}
    </div>
  )
}

export default DashboardProvider
