
"use client"
import { useRouter } from 'next/navigation'
import  {ArrowLeft}  from 'lucide-react'
import { Progress } from "@/components/ui/progress";
import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import { useUser } from '@/app/provider';
import { Inter } from 'next/font/google'
import InterviewLink from './_components/interviewLink'

const inter = Inter({ subsets: ['latin'] })

function CreateInterview() {

    const router = useRouter();
    const [step,setStep]=useState(1);
    const [formData,setFormData]=useState();
    const [interviewId,setInterViewId] = useState();
    const {user} = useUser();




 const onHandleInputChange=(field,value)=>{
    setFormData(prev=>({
        ...prev,
        [field]:value
    }))

    console.log('FormData',formData)
 }


 const onGoToNext=()=>{
  if(user?.credits<=0){

    toast("please add credit")
    return ;
  }
    if(!formData?.jobPosition||!formData?.jobDescription||!formData?.duration||!formData?.type){
        toast('please enter all details')
        return;
    }
    setStep(step+1);

    
 }

 const onCreateLink = (interview_id) =>{

  setInterViewId(interview_id);
  setStep(step+1);

 }

  return (
    <div className='ml-70 mt-5 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex gap-5 items-center'>
      <ArrowLeft onClick={()=>router.back()}/>
      <h2 className='font-bold text-2xl'>Create  new interview</h2>
      
      </div>
      <Progress value={step*33.33} />
     {step===1?<FormContainer  onHandleInputChange={onHandleInputChange}
     GoToNext={()=>onGoToNext()}
     />:step===2?<QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)} />:
     step===3?<InterviewLink interview_id={interviewId}
     formData={formData}
     />:
     null}
    </div>
  )
}

export default CreateInterview
