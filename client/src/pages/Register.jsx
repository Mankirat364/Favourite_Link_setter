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
            const response = await axios.post('http://localhost:3000/user/register', formData, {
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
            const response = await axios.get("http://localhost:3000/user/getToken", {
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
        <div className='h-screen w-screen flex px-4 py-4 RegsiterPageBackground'>

            <div className="left-box w-[55vw] h-[80%]">
                <div className="content flex flex-col items-center">
                    <div className=" flex items-center">
                        <div className="logo"><SiGnuprivacyguard className='w-16 h-16 text-white' /></div>
                        <h1 className='pt-2 text-white font-bold text-[4vw]'>Sign Up</h1>
                    </div>
                    <p className='pt-2 text-zinc-500'>welcome to Favstorage Setter - Let's create account</p>
                    {/* <div className="button pt-2 ">
                        <button onClick={handleGoogleLogin} className='flex items-center gap-2 border border-zinc-500 py-3 justify-center w-[38vw] rounded-2xl hover:bg-black transition-all ease-linear  font-[500] hover:text-white cursor-pointer '><FcGoogle size={30} /> Login With Google</button>
                    </div> */}
                    <h1 className='mt-4 border-white text-white border-t border-b pb-2 text-center w-[70%] pt-2'>
                        Get Started
                    </h1>
                </div>
                <form onSubmit={handleRegisterSubmit} className='flex text-white max-w-[70%] m-auto flex-col pt-4'>
                    <div className="flex flex-col gap-2">
                        <div className="">
                            <label htmlFor="name">Name</label>
                        </div>
                        <input type="text" name='username' value={formData.username} onChange={handleInputChange} className='border border-zinc-500 font-[500] outline-none p-3 rounded-2xl' placeholder='Enter Your name' />
                    </div>
                    <div className="flex flex-col pt-4 gap-2">
                        <div className="">
                            <label htmlFor="name">E-mail</label>
                        </div>
                        <input name='email' type="email" value={formData.email} onChange={handleInputChange} className='border border-zinc-500 font-[500]  outline-none p-3 rounded-2xl' placeholder='Enter Your Email' />
                    </div>
                    <div className="flex flex-col pt-4 gap-2 ">
                        <div className="">
                            <label htmlFor="name">Password</label>
                        </div>
                        <div className="relative w-full">
                            <input name='password' type={passopen === false ? 'text' : 'password'} className='border border-zinc-500 w-full font-[500]  outline-none p-3 rounded-2xl' placeholder='Enter Your Password' value={formData.password} onChange={handleInputChange} />
                            {passopen ? <IoIosEyeOff size={25} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={passwordOnOff} /> : <IoIosEye size={25} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={passwordOnOff} />}

                        </div>
                    </div>
                    <div className="flex pt-4 gap-2 w-full">
                        <button className='flex w-full p-2 rounded-xl justify-center  bg-zinc-900 hover:bg-zinc-800 cursor-pointer text-white items-center gap-2'>Register <FaLocationArrow color='white' /> </button>
                    </div>
                    <div className="flex pt-4 gap-2 w-full">
                        Created an account ? <Link to='/login' className='underline'>Login</Link>
                    </div>
                </form>
            </div>
            <div className="right-box w-[45vw] h-[100%]  flex flex-col justify-center ">
                <img src={illustration} className='w-full h-full object-cover rounded-2xl ' alt="" />
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
                    theme="light"
                    transition={Bounce}
                />

            )}
        </div>
    )
}

export default Register
