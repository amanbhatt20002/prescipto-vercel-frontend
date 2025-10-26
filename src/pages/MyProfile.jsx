import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { loadUserProfileData, userData, setUserData, token, backendUrl } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);
      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-12">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-32 h-32 rounded-full object-cover shadow-md mb-4 hidden"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            src={userData.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md mb-4"
          />
        )}

        {/* Profile Fields */}

        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <p className="text-gray-800">{userData.name}</p>
        )}

        <hr />
        {/* Email */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Email</label>
          {isEdit ? (
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-800">{userData.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Phone</label>
          {isEdit ? (
            <input
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-800">{userData.phone}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Address
          </label>
          {isEdit ? (
            <>
              <input
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Address Line 1"
              />
              <input
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Address Line 2"
              />
            </>
          ) : (
            <p className="text-gray-800">
              {userData.address.line1}, {userData.address.line2}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">Gender</label>
          {isEdit ? (
            <select
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="text-gray-800 capitalize">{userData.gender}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Date of Birth
          </label>
          {isEdit ? (
            <input
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-gray-800">{userData.dob}</p>
          )}
        </div>

        {/* Save Button */}
        {isEdit ? (
          <div className="mt-6 text-center">
            <button
              onClick={updateUserProfileData}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={()=>setIsEdit(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Edit
          </button>
        )}
      </div>
    )
  );
};

export default MyProfile;
