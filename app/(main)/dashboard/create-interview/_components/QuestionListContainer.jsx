import React from 'react'


function QuestionListContainer({questionsList}) {
  return (
    <div>
         <h2 className='font-medium text-xl mb-10 mt-10'>GENERATED QUESTIONS : </h2>
        <div className='p-5 border border-gray rounded-xl bg-white'>
        {questionsList.map((item,index)=>(
          <div key={index} className='p-3 border-gray-50 rounded-xl mb-3'>
          <h2 className='font-bold'>{item.question || item.q}</h2>
          <h2 className='text-sm text-gray-500'>TYPE : {item?.type}</h2>
          </div>
         ))}
        </div>  
      
    </div>
  )
}

export default QuestionListContainer
