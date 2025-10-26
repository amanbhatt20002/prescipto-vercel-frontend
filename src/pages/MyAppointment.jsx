import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointment = async () => {
    try {
      console.log("before");

      const { data } = await axios.get(backendUrl + "/api/user/appointment", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order_id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (data.success) {
            toast.success(data.message);
            getUserAppointment();
            navigate("/my-appointments");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        initPay(data.order);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        My Appointments
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={item.docData.image}
              alt={item.docData.name}
              className="w-32  bg-indigo-50"
            />

            <div className="p-4 flex flex-col gap-2">
              <p className="font-medium text-lg text-gray-900">
                {item.docData.name}
              </p>
              <p className="text-sm text-gray-600">{item.docData.speciality}</p>
              <div className="text-sm text-gray-500">
                <p>Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                <span className="font-medium">Date & Time:</span>{" "}
                {slotDateFormat(item.slotDate)} &{item.slotTime}
              </p>
            </div>
            <div></div>

            <div className="p-4 flex gap-3 border-t border-gray-200">
              {!item.cancelled && item.payment && (
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-red-500 transition-colors">
                  paid
                </button>
              )}
              {!item.cancelled && !item.payment && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Pay Online
                </button>
              )}

              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-red-500 transition-colors"
                >
                  Cancel Appointment
                </button>
              )}
              {item.cancelled && (
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-red-500 transition-colors">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
