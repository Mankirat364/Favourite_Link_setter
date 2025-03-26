import React, { useEffect, useState } from 'react'
import illustration from '../assets/illus.jpg'
import { SiGnuprivacyguard } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { FaLocationArrow } from "react-icons/fa6";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import background from '../assets/background.png'
import { Bounce, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
const Register = () => {
    const [passopen, setIsPassOpen] = useState(false)
    const [user1, setUser1] = useState(null)
    const [user, setUser] = useState(null)
    const [error, getError] = useState([])
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
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
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Before Sending:", formData);

        try {
            const response = await axios.post('https://favourite-link-setter-backend.onrender.com/user/register', formData, {
                withCredentials: true
            });
            console.log("Registration Successful:", response.data);
            localStorage.setItem("User1", JSON.stringify(response?.data?.user))
           
            fetchToken();
        } catch (error) {
            getError(error.response?.data || error.message)

        }
    };
    useEffect(() => {
        if (error && error.error && Array.isArray(error.error) && error.error.length > 0) {
            const messageError =  error.error[0].path[0] + ":" + error.error[0].message ;

            toast.error(messageError);

        } else if (error && error.message) {
            toast.error(error.message);
        }

    }, [error])

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
            toast.success("User Succsesfully Regsiterd")
        } catch (error) {
            console.error("Error fetching token:", error.response?.data || error.message);
        }
    };

    function passwordOnOff() {
        setIsPassOpen(!passopen)
    }
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            console.log("Received Token:", token);
            localStorage.setItem("authToken", token);
            fetchuserdata(token);
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1000); 
        }
    }, []);


    const fetchuserdata = async (token) => {
        if (!token) {
            console.error("No token found")
            return
        }
        console.log('token being sent', token);

        try {
            const response = await fetch("http://localhost:3000/user/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }
            const data = await response.json();
            console.log("API Response:", data);
            if (data.user) {
                setUser(data.user)
                localStorage.setItem("user", JSON.stringify(data.user));
            }

        } catch (error) {
            console.error('error fetching the user data', error)
        }
    }


    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row px-4 py-4 items-center bg-gray-900">

            <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center text-white p-6">
                <div className="flex items-center gap-3">
                    <SiGnuprivacyguard className="w-12 h-12 text-white" />
                    <h1 className="text-3xl md:text-4xl font-bold">Sign Up</h1>
                </div>
                <p className="pt-2 text-gray-400 text-center text-sm md:text-base">
                    Welcome to Favstorage Setter - Let's create your account
                </p>

                <h1 className="mt-4 border-t border-b border-gray-500 text-center w-4/5 py-2 text-lg">
                    Get Started
                </h1>

                <form onSubmit={handleRegisterSubmit} className="flex flex-col w-full max-w-md pt-4 gap-4">
               
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border border-gray-500 outline-none p-3 rounded-lg bg-gray-800 text-white"
                            placeholder="Enter Your Name"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border border-gray-500 outline-none p-3 rounded-lg bg-gray-800 text-white"
                            placeholder="Enter Your Email"
                        />
                    </div>

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

                    <button
                        className="flex w-full p-3 rounded-lg justify-center bg-blue-600 hover:bg-blue-500 transition text-white items-center gap-2"
                    >
                        Register <FaLocationArrow color="white" />
                    </button>

                    <p className="text-center text-sm md:text-base">
                        Already have an account? <Link to="/login" className="underline text-blue-400">Login</Link>
                    </p>
                </form>
            </div>

            <div className="w-full md:w-1/3 lg:w-1/2 flex justify-center items-center">
                <img
                    src={illustration}
                    className="w-full max-w-md h-auto rounded-lg object-cover"
                    alt="Signup Illustration"
                />
            </div>

            {error && (
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
            )}
        </div>
    )
}

export default Register
