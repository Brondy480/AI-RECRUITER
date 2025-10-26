import React from 'react'
import Image from 'next/image'

function InterviewHeader() {
  return (
    <div className='p-4 shadow-sm'>
       <Image src={'/Logo1.jpg'} alt='logo'
  width={250} height={100}
  className='w-[100px] rounded-2xl'
  />
    </div>
  )
}

export default InterviewHeader
