"use client"
import { useState } from "react"
import React from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDataContext } from '@/Context/InterviewDataContext'

function InterviewLayout({children}) {

    const [interviewInfo,setInterviewInfo] = useState();

  return (
    <InterviewDataContext.Provider value={{interviewInfo,setInterviewInfo}}>
    <div className='bg-secondary min-h-screen'>
    <InterviewHeader/>
      {children}
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout
