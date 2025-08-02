import React from 'react'

const SummaryCard = ({icon,text,number}) => {
  return (
    <div className='rounded flex bg-white'>
        <div className='flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-l'>
           {icon}
        </div>
        <div className='p-4 py-1'>
            <p className='text-lg font-semibold'>{text}</p>
            <p className='text-xl font-bold'>{number}</p>
        </div>
    </div>
  )
}

export default SummaryCard