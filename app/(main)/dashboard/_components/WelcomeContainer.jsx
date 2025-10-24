"use client"
import React from 'react'
import { useUser } from '@/app/provider'
import Image from 'next/image'


function WelcomeContainer() {

     const {user} = useUser();

  return (

   
<div className='bg-gray-100 w-[1200px] p-5 rounded-2xl flex justify-between item-center ml-70 mt-5'>
    <div >
     <h2 className='text-lg font-bold'>Welcome back {user?.name} </h2>
     <h2 className='text-gray-500'>AI DRIVEN INTERVIEW ASSISTANT</h2>

    </div>
    {user?.picture && (
        <Image src={user.picture} width={100} height={100} alt="logo" className='rounded-full'/>
      )}
    </div>
  )
}

export default WelcomeContainer
