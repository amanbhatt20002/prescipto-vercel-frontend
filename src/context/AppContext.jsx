import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
 

  
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  // Fetch doctor data
  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors); // ✅ Correct way
        console.log("Doctor data fetched successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      toast.error("Error fetching doctor data");
    }
  };

  const loadUserProfileData = async () => {
    try {
      console.log("before");
      
     const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
  headers: { Authorization: `Bearer ${token}` },
});
    console.log("API response data :", data);

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    }catch (error) {
  console.error("Error fetching user profile:", error);
  if (error.response?.status === 401) {
    toast.error("Session expired or unauthorized. Please log in again.");
    localStorage.removeItem("token");
    setToken(false);
  } else {
    toast.error("Error fetching user profile");
  }
}

  };

  const value = {
    currencySymbol,
    doctors, // include doctors in context if you want to use them elsewhere
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorData
  };
  // useEffect at top level
  useEffect(() => {
    getDoctorData();
  }, []);
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
