import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Fetch doctor details
  const fetchDocInfo = async () => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info);
  };

  // Generate available slots for the next 7 days
  const getAvailableSlot = async () => {
    if (!docInfo) return;

    let allSlots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Set start time logic
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let date = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${date}_${month}_${year}`;
        const slotTime = formattedTime;
        const isSlotAvailable = !(docInfo?.slots_booked?.[slotDate]?.includes(slotTime));

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlot(allSlots);
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      return navigate("/login");
    }

    if (!docSlot[slotIndex] || docSlot[slotIndex].length === 0) {
      toast.info("No available slots for this day");
      return;
    }

    if (!slotTime) {
      toast.info("Please select a time slot");
      return;
    }

    try {
      const selectedDate = docSlot[slotIndex][0].datetime;
      let day = selectedDate.getDate();
      let month = selectedDate.getMonth() + 1;
      let year = selectedDate.getFullYear();
      const slotDate = `${day}_${month}_${year}`;
      
    

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     

      if (data.success) {
        toast.success(data.message);
        getDoctorData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
     
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlot();
  }, [docInfo]);

  return (
    docInfo && (
      <div className="w-full px-4 py-6">
        {/* Doctor Details */}
        <div className="flex flex-col md:flex-row gap-8 bg-white shadow-md rounded-2xl p-6">
          <div className="flex-shrink-0">
            <img
              src={docInfo.image}
              alt={docInfo.name}
              className="bg-blue-500 w-40 h-40 md:w-56 md:h-56 object-cover rounded-xl border"
            />
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
              {docInfo.name}
              <img src={assets.verified_icon} alt="Verified" className="w-5 h-5" />
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-gray-600">
              <p className="text-base font-medium">
                {docInfo.degree} – {docInfo.speciality}
              </p>
              <button className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div className="mt-6">
              <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                About <img src={assets.info_icon} alt="Info" className="w-4 h-4" />
              </p>
              <p className="mt-2 text-gray-600 leading-relaxed">{docInfo.about}</p>
            </div>
            <p className="text-gray-700 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-indigo-600 font-semibold">
                {currencySymbol}
                {docInfo.fee}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">
          <p className="text-lg font-semibold text-gray-900 mb-4">Booking Slots</p>

          {/* Day Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => {
                const isSelectedDay = index === slotIndex;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime("");
                    }}
                    className={`cursor-pointer shadow-md rounded-xl p-4 flex flex-col items-center transition ${
                      isSelectedDay
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-white text-gray-800 hover:shadow-lg"
                    }`}
                  >
                    <p className="font-bold text-sm">
                      {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                    </p>
                    <p className="text-lg font-semibold">
                      {item[0] && item[0].datetime.getDate()}
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Time Slots */}
          <div className="flex flex-wrap">
            {docSlot.length > 0 &&
              docSlot[slotIndex] &&
              docSlot[slotIndex].map((item, index) => {
                const isSelectedTime = item.time === slotTime;
                return (
                  <p
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`inline-block px-3 py-1 m-1 rounded-full text-sm cursor-pointer transition ${
                      isSelectedTime
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                );
              })}
          </div>

          {/* Selected Summary */}
          {slotTime && docSlot[slotIndex]?.length > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 text-indigo-700 rounded-lg">
              Selected Appointment:{" "}
              {daysOfWeek[docSlot[slotIndex][0].datetime.getDay()]}{" "}
              {docSlot[slotIndex][0].datetime.getDate()} at {slotTime}
            </div>
          )}
        </div>

        <button
          onClick={bookAppointment}
          className="my-6 mt-4 w-full sm:w-auto px-14 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          Book An Appointment
        </button>

        {/* Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
