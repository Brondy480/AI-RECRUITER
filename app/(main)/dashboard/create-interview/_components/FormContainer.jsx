import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InterviewType } from '@/service/Constants'
import { Button } from '@/components/ui/button'
import { Arrow } from '@radix-ui/react-tooltip'
import { ArrowLeft, ArrowRight } from 'lucide-react'

function FormContainer({onHandleInputChange,GoToNext}) {

    const [interviewType,setInterviewType]=useState([]);

    useEffect(()=>{
        if(interviewType.length > 0) // Changed condition
        {
            onHandleInputChange('type',interviewType)
        }
    }, [interviewType])

    const AddInterviewType = (type)=>{
        // Add debugging
        console.log('Clicked type:', type);
        console.log('Current interviewType array:', interviewType);
        
        const data = interviewType.includes(type);
        console.log('Is type already included?', data);
        
        if(!data)
        {
            console.log('Adding type to array');
            setInterviewType(prev => {
                const newArray = [...prev, type];
                console.log('New array after adding:', newArray);
                return newArray;
            });
        }else{
            
            const result = interviewType.filter(item=>item!==type);
            console.log('New array after removing:', result);
            setInterviewType(result);
        }
    }

    // Add debugging for InterviewType data
    console.log('InterviewType data:', InterviewType);

  return (
    <div className='p-5 bg-gray-100 mt-5'>
      <div className='mt-5'>
        <h2 className='text-sm'>Job Position</h2>
        <Input placeholder="e.g: Fullstack develloper" className={'mt-2'}
        onChange={(e)=>onHandleInputChange('jobPosition',e.target.value)}
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm'>Job description</h2>
        <Textarea placeholder='enter detail job description' className={'mt-2 h-[200px] '}
        onChange={(e)=>onHandleInputChange('jobDescription',e.target.value)}
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm'>Interview duration</h2>
        <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
          <SelectTrigger className="w-[180px] mt-2">
            <SelectValue placeholder="select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 min">5 min</SelectItem>
            <SelectItem value="15 min">15 min</SelectItem>
            <SelectItem value="30 min">30 min</SelectItem>
            <SelectItem value="45 min">45 min</SelectItem>
            <SelectItem value="60 min">60 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm'>Interview type</h2>
        <div className='mt-2 flex gap-3 flex-wrap'>
          {InterviewType.map((type,index)=>(
            <div 
              key={type.title} 
              className={`border-gray-300 rounded-md border-2 p-2 flex gap-2 items-center mt-2 cursor-pointer hover:bg-secondary ${interviewType.includes(type.title) ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => {
                console.log('Div clicked, type.title:', type.title);
                console.log('Is selected?', interviewType.includes(type.title));
                AddInterviewType(type.title);
              }}
            >
              <type.icon/>
              <span>{type.title} {interviewType.includes(type.title) ? '✓' : ''}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className='flex justify-end' onClick={()=>GoToNext()}>
        <Button className='mt-5'>GENERATE QUESTIONS <ArrowRight/></Button>
      </div>
    </div>
  )
}

export default FormContainer