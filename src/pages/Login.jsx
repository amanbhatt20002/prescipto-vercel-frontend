import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // handle submit logic
    try {
      if (state == "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold mb-2">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p className="text-gray-600 text-sm">
            Please {state === "Sign Up" ? "Sign Up" : "Log in"} to book
            appointment
          </p>
        </div>

        {/* Full Name (only for Sign Up) */}
        {state === "Sign Up" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="example@mail.com"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="********"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-full font-semibold shadow-md hover:bg-indigo-700 transition duration-300"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Toggle Sign Up / Login */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          {state === "Sign Up"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="text-indigo-600 font-semibold cursor-pointer"
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
