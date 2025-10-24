import { Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import supabase from '@/service/supabaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

function QuestionList({formData,onCreateLink}) {
   const [loading, setLoading] = useState(true);
   const [questionList, setQuestionList] = useState([]);
   const [finishing, setFinishing] = useState(false);
   const {user} = useUser();
       
   useEffect(() => {
       if(formData){
          GenerateQuestionList();
      }
   }, [formData])

 const onFinish = async () => {
  setFinishing(true);
  let interview_id = null; // ✅ declare it here so it's always available

  try {
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

    if (!questionList || questionList.length === 0) {
      toast("No questions to save. Please generate questions first.");
      setFinishing(false);
      return;
    }

    if (!currentUser?.email) {
      toast("Please log in to save your interview questions.");
      setFinishing(false);
      return;
    }

    interview_id = uuidv4(); // ✅ assign inside try

    const insertData = {
      ...formData,
      questionList: questionList,
      userEmail: currentUser.email,
      interview_id: interview_id,
    };

    const { data, error } = await supabase
      .from('Interviews')
      .insert([insertData])
      .select();
      // update user credit

      
const userUpdate = await supabase
  .from('interview_feedback')
  .update({ credits: Number(user?.credits)-1 })
  .eq('email', user?.email)
  .select()

  console.log(userUpdate)
          

    if (error) {
      console.error('Supabase error:', error);
      toast(`Database error: ${error.message}`);
      setFinishing(false);
      return;
    }

    toast("Interview questions saved successfully!");
  } catch (error) {
    console.error('Unexpected error:', error);
    toast("An unexpected error occurred. Please try again.");
  } finally {
    setFinishing(false);
    if (interview_id) {
      onCreateLink(interview_id); // ✅ only call if we actually created one
    }
  }
};


   const GenerateQuestionList = async () => {
       setLoading(true)
       let result = null;
       
       try {
           result = await axios.post('/api/ai-model', {
               ...formData
           })
           console.log(result.data)
           
           // Check if result.data exists and has the message structure
           if (!result.data || !result.data.message || !result.data.message.content) {
               throw new Error('No content received from API');
           }
           
           // Get the content from the response
           let content = result.data.message.content;
           
           console.log('Original content:', content);
           
           // More robust cleaning of markdown code blocks
           content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
           
           // Handle different possible formats
           if (content.startsWith('interviewQuestions=')) {
               content = `{"interviewQuestions":${content.substring('interviewQuestions='.length)}}`;
           } else if (content.includes('"interviewQuestions"') && !content.startsWith('{')) {
               content = `{${content}}`;
           }
           
           console.log('Cleaned content:', content);
           console.log('Content length:', content.length);
           
           // Validate that we have complete JSON before parsing
           if (!content || content.length < 10) {
               throw new Error('Content too short or empty after cleaning');
           }
           
           // Check if content looks like valid JSON structure
           if (!content.includes('{') && !content.includes('[')) {
               throw new Error('Content does not appear to be valid JSON structure');
           }

           // Parse the JSON with error handling
           let parsedContent;
           try {
               parsedContent = JSON.parse(content);
           } catch (parseError) {
               console.log('First JSON parse failed:', parseError);
               console.log('Attempting to fix common JSON issues...');
               
               // Try to fix common JSON issues
               let fixedContent = content
                   .replace(/,\s*}/g, '}')  // Remove trailing commas before }
                   .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
                   .replace(/'/g, '"')      // Replace single quotes with double quotes
                   .replace(/\n/g, ' ')     // Replace newlines with spaces
                   .trim();
               
               try {
                   parsedContent = JSON.parse(fixedContent);
                   console.log('JSON parsing succeeded after fixes');
               } catch (secondParseError) {
                   console.log('Second JSON parse also failed:', secondParseError);
                   console.log('Raw content that failed:', content);
                   throw new Error(`JSON parsing failed: ${secondParseError.message}`);
               }
           }
           
           // Handle both formats: direct array or object with interviewQuestions property
           let questions;
           if (Array.isArray(parsedContent)) {
               // Direct array format
               questions = parsedContent;
           } else if (parsedContent.interviewQuestions && Array.isArray(parsedContent.interviewQuestions)) {
               // Object with interviewQuestions property
               questions = parsedContent.interviewQuestions;
           } else {
               throw new Error('Invalid response format: expected array or object with interviewQuestions');
           }
           
           // Set the questions list
           setQuestionList(questions);
           setLoading(false)
           
       } catch (error) {
           toast("Server error, try again")
           setLoading(false)
           console.log('Error:', error)
           console.log('Raw content:', result?.data?.content)
       }
   }

   return (
       <>
           {loading && (
               <div>
                   <Loader2Icon className='animate-spin'/>
                   <div className='p-5 bg-blue-50 rounded-xl border border-blue-200 flex gap-5 items-center'>
                       <h2 className='font-bold'>Generate Interview questions</h2>
                       <p className='text-gray-500'>Our AI is crafting personalised questions based on your job position</p>
                   </div>
               </div>
           )}
           
           {questionList && questionList.length > 0 && (
               <div>
                   <QuestionListContainer questionsList={questionList}/>
               </div>
           )}
           
           <div className='flex justify-end'>
               <button 
                   className={`mt-10 flex w-[200px] h-20 text-bold rounded-xl justify-center items-center ${
                       finishing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'
                   }`}
                   onClick={onFinish}
                   disabled={finishing || !questionList?.length}
               >
                   {finishing ? <Loader2Icon className='animate-spin w-4 h-4' /> : 'Create interview link and finish'}
               </button>
           </div>
       </>
   )
}

export default QuestionList;