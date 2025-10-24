"use client"
import React, { useEffect, useState } from 'react'
import InterviewHeader from "../_components/InterviewHeader"
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import supabase from '@/service/supabaseClient'
import { toast } from 'sonner'
import { useContext } from 'react'
import { InterviewDataContext } from '@/Context/InterviewDataContext'
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'




function Interview() {

    const {interview_id} = useParams();
    console.log(interview_id)

    const [interviewData,setInterviewData] = useState();
    const [loading,setLoading] = useState(true);
    const [userName,setUserName] = useState(false);
    const {interviewInfo,setInterviewInfo} = useContext(InterviewDataContext);
    const [userEmail,setUserEmail] = useState();
    const router = useRouter();




    useEffect(()=>{
        interview_id&&GetInterviewDetail();
    },[interview_id])


    const GetInterviewDetail = async() =>{
        setLoading(true);

        try {
        let { data: Interviews, error } = await supabase
  .from('Interviews')
  .select("jobPosition,jobDescription,duration,type")
  .eq('interview_id', interview_id)
        setInterviewData(Interviews[0]);
setLoading(false);

  if(Interviews?.length==0){
    toast('interview link incorect')
    return 
  }
  setLoading(false);
  
    }  
    catch (error) {
        setLoading(false);
        console.log(error);
        toast('interview link incorect')
            
        }

  } 

  const onjoinInterview = async() =>{
    setLoading(true);

    let {data : Interviews , error} = await supabase
    .from("Interviews")
    .select('*')
    .eq('interview_id',interview_id);

    console.log(Interviews[0])
    setInterviewInfo({
        userName : userName,
        userEmail : userEmail,
       interviewData : Interviews[0],
       
    });
    router.push('/interview/'+interview_id+'/start');
    setLoading(false);
  }

  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-56 mt-16 mb-20'>
    <div className='flex flex-col items-center  justify-center lg:px-5 xl:px-52 px-10 border rounded-lg bg-white'>
   <Image src={'/Logo1.jpg'} alt='logo'
     width={250} height={100}
     className='w-[100px] rounded-2xl'
     />
     <h2 className='mt-3'>Nk recruiter </h2>
     <Image className='w-[280px] rounded-2xl my-6' src={'/logo.jpg'} width={250} height={150}/>

     <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>
     <h2 className='flex gap-2 items-center text-gray mt-3'><Clock className='h-4 w-4'/>{interviewData?.duration}</h2>
     <div>
     <h2>Enter your full name </h2>
     <Input placeholder={"eg john smith"} onChange={(e)=>setUserName(e.target.value)}/>
     </div>
     <div>
     <h2>Enter your email </h2>
     <Input placeholder={"eg johnsmith@gmail.com"} onChange={(e)=>setUserEmail(e.target.value)}/>
     </div>
     <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-5'>
     <Info className='text-primary'/>
     <div>
     <h2>Before you begin</h2>
     <ul>
     <li className='text-sm text-primary'>Ensure you have a stable internet connection</li>
    <li className='text-sm text-primary'>Ensure you have a stable internet connection</li>
     <li className='text-sm text-primary'>Ensure you have a stable internet connection</li>
     </ul>
     </div>
     </div>
    <Button className="bg-blue-500 text-white flex items-center gap-2 mt-5 px-4 py-2 rounded"
     disabled={loading||!userName} onClick={()=>onjoinInterview()}> 
  <Video className="w-5 h-5" />
  {loading&&<Loader2Icon/>}
  Join Interview
</Button>

     </div>
    </div>
  )
}

export default Interview
