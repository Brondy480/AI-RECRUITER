
"use client"
import { Button } from '@/components/ui/button'
import supabase from '@/service/supabaseClient'
import Image from 'next/image'
import React from 'react'

function Login() {


  const signinWithGoogle = async () => {
    const {error}= await supabase.auth.signInWithOAuth({
      provider:'google',

    })

    if(error){
      console.log('error',error.message)
        }

  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
  <div className='flex flex-col items-center justify-center'>
  <Image src={'/Logo1.jpg'} alt='logo'
  width={250} height={100}
  className='w-[100px] rounded-2xl'
  />

  <div>
   <Image src={'/logo.jpg'} width={250} height={150} className='mt-10 rounded-2xl'/>
  </div>
  <p className='text-2xl text-gray-500 font-bold mt-1 text-center'>welcome to nk recruiter</p>
  <h1 className='text-2xl text-gray-500 font-bold mt-1 text-center'>Login</h1>
  <Button className='mt-10  bg-black w-full text-white hover:bg-blue-600 ' onClick={signinWithGoogle}>
  Login with google
  </Button>
  </div>
 
    </div>
  )
}

export default Login
