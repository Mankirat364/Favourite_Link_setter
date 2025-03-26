  import React, { useEffect, useState } from 'react'
  import { ToastContainer } from 'react-toastify'
  import { SiGnuprivacyguard } from "react-icons/si";
  import { FcGoogle } from "react-icons/fc";
  import { FaLocationArrow } from "react-icons/fa6";
  import { IoIosEye } from "react-icons/io";
  import { IoIosEyeOff } from "react-icons/io";
  import { Link, useNavigate } from 'react-router-dom';
  import illustration from '../assets/illus.jpg'
  import background from '../assets/background.png'
  import { Bounce, toast } from "react-toastify"
  import "react-toastify/dist/ReactToastify.css";
  import axios from 'axios'
  import "react-toastify/dist/ReactToastify.css";
  const Login = () => {
    const navigate = useNavigate()
    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:3000/auth/google";
    };
    const [passopen, setIsPassOpen] = useState(false)
    const [formData, setFormData] = useState({
      email: "",
      password: ""
    })
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))

    }
    function passwordOnOff() {
      setIsPassOpen(!passopen)
    }

      useEffect(() => {
          const params = new URLSearchParams(window.location.search);
          const token = params.get("token");

          if (token) {
              console.log("Received Token:", token);
              localStorage.setItem("authToken", token);
              fetchuserdata(token);
              navigate("/", { replace: true });
          }
      }, []);
    const handleSubmit = async(e) =>{
      e.preventDefault()
      try {
          const response = await axios.post('https://favourite-link-setter-backend.onrender.com/user/login',formData, {
            withCredentials : true
          })
          console.log("Login Successful:", response.data);
          localStorage.setItem("User1", JSON.stringify(response?.data?.user))
          fetchToken()
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    }
    
    const fetchToken = async () => {
          try {
              const response = await axios.get("https://favourite-link-setter-backend.onrender.com/user/getToken", {
                  withCredentials: true,
              });

              if (response.data.token) {
                  localStorage.setItem("authToken", response.data.token);
              }
              setTimeout(()=>{
                  navigate('/')
              }, 3000)
              toast.success("User Succsesfully Logged in")
          } catch (error) {
              console.error("Error fetching token:", error.response?.data || error.message);
              toast.error(error.response?.data?.message || "Error fetching token");
          }
      };
    return (
      <div className="min-h-screen w-full flex flex-col md:flex-row items-center px-4 py-6 bg-gray-900 text-white">

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            {/* Left Box - Form Section */}
            <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center p-6">
                <div className="flex items-center gap-3">
                    <SiGnuprivacyguard className="w-12 h-12 text-white" />
                    <h1 className="text-3xl md:text-4xl font-bold">Login</h1>
                </div>
                <p className="pt-2 text-gray-400 text-center text-sm md:text-base">
                    Welcome to Favstorage Setter - Let's Login
                </p>

                <h1 className="mt-4 border-t border-b border-gray-500 text-center w-4/5 py-2 text-lg">
                    Get Started
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md pt-4 gap-4">
                    {/* Email Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">E-mail</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border border-gray-500 outline-none p-3 rounded-lg bg-gray-800 text-white"
                            placeholder="Enter Your Email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                type={passopen ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="border border-gray-500 outline-none p-3 rounded-lg bg-gray-800 text-white w-full"
                                placeholder="Enter Your Password"
                            />
                            {passopen ? (
                                <IoIosEyeOff
                                    size={25}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={passwordOnOff}
                                />
                            ) : (
                                <IoIosEye
                                    size={25}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={passwordOnOff}
                                />
                            )}
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        className="flex w-full p-3 rounded-lg justify-center bg-blue-600 hover:bg-blue-500 transition text-white items-center gap-2"
                    >
                        Login <FaLocationArrow color="white" />
                    </button>

                    {/* Signup Link */}
                    <p className="text-center text-sm md:text-base">
                        Don't have an account? <Link to="/register" className="underline text-blue-400">Signup</Link>
                    </p>
                </form>
            </div>

            {/* Right Box - Image Section */}
            <div className="w-full md:w-1/3 lg:w-1/2 flex justify-center items-center">
                <img
                    src={illustration}
                    className="w-full max-w-md h-auto rounded-lg object-cover"
                    alt="Login Illustration"
                />
            </div>
        </div>
    )
  }

  export default Login
