import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality,docId}) => {

    const {doctors}=useContext(AppContext)
    const navigate=useNavigate()

    const [relDoc, setReldDoc]=useState([])
    useEffect(()=>{
        if(doctors.length>0&& speciality)
        {
            const doctorsData=doctors.filter((doc)=>doc.speciality===speciality && doc._id !==docId)
            setReldDoc(doctorsData)
        }

    },[doctors,speciality,docId])



  return (
     <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium '>Top Doctors To Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto?</p>
<div className='w-full flex flex-wrap gap-5 pt-5 px-3 sm:px-0'>
  {relDoc.slice(0,5).map((item,index)=>(
      <div  onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-4 transition-all duration-300 w-[200px]' 
        key={index} 
      >
          <img className='bg-blue-50 w-full h-40 object-cover' src={item.image} alt="" />
          <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                  <p>Available</p>
              </div>
              <p className='font-medium text-gray-900 text-lg'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
          </div>
      </div>
  ))}
</div>

      <button onClick={()=>{navigate(`/doctors`) ;scrollTo(0,0)}} className='cursor-pointer hover:scale-105 transition-all hover:bg-blue-100  bg-gray-50  text-gray-600 px-12 py-3 rounded-full mt-10 font-medium'>more</button>
    </div>
  )
}

export default RelatedDoctors
