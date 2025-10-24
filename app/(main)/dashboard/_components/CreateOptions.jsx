import {  Phone, Video } from 'lucide-react'
import React from 'react'
import Link from 'next/link'


function CreateOptions() {
  return (
    <div className='ml-10 grid grid-cols-2 gap-15  items-center'>
      <Link href='/dashboard/create-interview' className='bg-gray-100  border-gray-200 rounded-lg p-5 '>
      <Video className=' '/>
      <h2 className='font-bold'>Create new interview</h2>
      <p className='text-gray-500'>Create Ai interview and schedule them with candidate</p>
      </Link>
      <div className='bg-gray-100  border-gray-200 rounded-lg p-5 '>
      <Phone/>
       <h2 className='font-bold'>Create Phone Screening call</h2>
      <p className='text-gray-500'>Schedule phone screening call with candidate </p>
      
      </div>
    </div>
  )
}

export default CreateOptions
