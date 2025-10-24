import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Mail, Plus } from 'lucide-react';
import { List } from 'lucide-react';
import { Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';



function InterviewLink({interview_id,formData}) {
  const url= process.env.NEXT_PUBLIC_HOST_URL+"/"+interview_id;

    const GetInterviewUrl=()=>{
      return url;
    }

    const onCopyLink=async()=>{
      await navigator.clipboard.writeText(url);
      toast("link copied")

      
    }

  return (
    <div className='flex flex-col gap-5 items-center justify-center bg-white mt-5 p-5'>
     
      <h2 className='text-2xl font-bold'>Your interview link is ready</h2>
      <p className='mt-3'>share this link with your candidate to start the interview process</p>

      <div>
    <div className='flex justify-between items-center'>
    <h2 >Interview Link</h2>
    <h2 className='p-1 px-2 text-primary bg-blue-50 rounded-xl'>Valid for 30 days</h2>
      </div>
      </div> 
          <div className='mt-3'>
    <div className='flex gap-2'>
        <Input defaultValue={GetInterviewUrl()} disabled={true} className="flex-1"/>
        <Button onClick={()=>onCopyLink()}>Copy link</Button>
    </div>
</div>
<hr className='my-7'/>

<div className='grid grid-cols-3 gap-4'>
    <div className='flex gap-2 text-gray-600 bg-gray-50 p-3 rounded-md'>
        <Clock className="w-4 h-4 mt-0.5"/> 
        <div>
            <p className='text-xs text-gray-500'>Duration</p>
            <p className='text-sm font-medium'>{formData?.duration}</p>
        </div>
    </div>
    <div className='flex gap-2 text-gray-600 bg-gray-50 p-3 rounded-md'>
        <List className="w-4 h-4 mt-0.5"/>
        <div>
            <p className='text-xs text-gray-500'>Questions</p>
            <p className='text-sm font-medium'>{formData?.questions}</p>
        </div>
    </div>
    <div className='flex gap-2 text-gray-600 bg-gray-50 p-3 rounded-md'>
        <Users className="w-4 h-4 mt-0.5"/> 
        <div>
            <p className='text-xs text-gray-500'>Participants</p>
            <p className='text-sm font-medium'>{formData?.participants}</p>
        </div>
    </div>
</div>
<div className='mt-7 bg-white p-5 rounded-lg'>
<h2 className='font-bold'>Share Via</h2>
<div className='gap-5 mt-2 flex'>
<Button className='w-full' variant={'outline'}>
<Mail/> Email
</Button> 
<Button className='w-full' variant={'outline'}>
<Mail/> Slack
</Button>
<Button className='w-full' variant={'outline'}>
<Mail/> Whatsapp
</Button>
</div>

<div className='flex w-full gap-5 justify-between mt-6'>
 <Link href={'/dashboard'}>
  <Button variant={'outline'}  ><ArrowLeft/> Back to dashboard</Button>
 </Link>
 <Link href={'/create-interview'}>
   <Button><Plus/>Create new interview</Button>
   </Link>
</div>
</div>
    
    </div>
  )
}

export default InterviewLink
