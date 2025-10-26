import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-3xl font-bold">
          ABOUT <span className="text-indigo-600">US</span>
        </p>
      </div>

      {/* Content */}
      <div className="my-10 flex flex-col md:flex-row items-center gap-12">
        
        {/* Image */}
        <img 
          src={assets.about_image} 
          alt="About" 
          className="w-full md:max-w-[360px] rounded-xl object-cover shadow-md"
        />

        {/* Text */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-700 space-y-4">
          <p>
            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>
          <b className="block text-indigo-600 text-lg mt-4">Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>

      </div>

   {/* WHY CHOOSE US Section */}
<div className="my-16 max-w-7xl mx-auto px-4">
  
  {/* Header */}
  <div className="text-center mb-12">
    <p className="text-3xl font-bold">
      WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
    </p>
  </div>

  {/* Features Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
    
    {/* Feature 1 */}
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <b className="text-lg text-indigo-600 block mb-2">Efficiency:</b>
      <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
    </div>

    {/* Feature 2 */}
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <b className="text-lg text-indigo-600 block mb-2">Convenience:</b>
      <p>Access to a network of trusted healthcare professionals in your area.</p>
    </div>

    {/* Feature 3 */}
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <b className="text-lg text-indigo-600 block mb-2">Personalization:</b>
      <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
    </div>

  </div>
</div>

    </div>
  )
}

export default About
