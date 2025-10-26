import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-3xl font-bold">
          CONTACT <span className="text-indigo-600">Us</span>
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        
        {/* Image */}
        <img 
          src={assets.contact_image} 
          alt="Contact" 
          className="w-full md:max-w-[360px] rounded-xl shadow-md object-cover"
        />

        {/* Text Info */}
        <div className="md:w-1/2 flex flex-col gap-4 text-gray-700">
          
          <p className="text-lg font-semibold">Our OFFICE</p>
          <p>54709 Willms Station <br />Suite 350, Washington, USA</p>
          <p>
            Tel: (415) 555‑0132 <br />
            Email: greatstackdev@gmail.com
          </p>

          <p className="text-lg font-semibold mt-4">Careers at PRESCRIPTO</p>
          <p>Learn more about our teams and job openings.</p>

          <button className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 w-max cursor-pointer">
            Explore Jobs
          </button>

        </div>

      </div>
    </div>
  )
}

export default Contact
