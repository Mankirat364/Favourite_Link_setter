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
          const response = await axios.post('http://localhost:3000/user/login',formData, {
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
              const response = await axios.get("http://localhost:3000/user/getToken", {
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
      <div>
        < div className='h-screen w-screen flex px-4 py-4 RegsiterPageBackground'>
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
          <div className="left-box w-[55vw] text-white h-[80%]">
            <div className="content flex flex-col items-center">
              <div className=" flex items-center">
                <div className="logo"><SiGnuprivacyguard className='w-16 h-16' /></div>
                <h1 className='pt-2 font-bold text-[4vw]'>Login</h1>
              </div>
              <p className='pt-2 text-zinc-500'>welcome to Favstorage Setter - Let's Login</p>
              {/* <div className="button pt-2 ">
                <button onClick={handleGoogleLogin} className='flex items-center gap-2 border border-zinc-500 py-3 justify-center w-[38vw] rounded-2xl hover:bg-black transition-all ease-linear  font-[500] hover:text-white cursor-pointer '><FcGoogle size={30} /> Login With Google</button>
              </div> */}
              <h1 className='mt-4 border-t border-b pb-2 text-center w-[70%] pt-2'>
                Get Started
              </h1>
            </div>
            <form onSubmit={handleSubmit} className='flex max-w-[70%] m-auto flex-col pt-4'>
            
              <div className="flex flex-col pt-4 gap-2">
                <div className="">
                  <label htmlFor="name">E-mail</label>
                </div>
                <input name='email' type="email" value={formData.email} onChange={handleInputChange} className='border font-[500]  border-zinc-500  outline-none p-3 rounded-2xl' placeholder='Enter Your Email' />
              </div>
              <div className="flex flex-col pt-4 gap-2 ">
                <div className="">
                  <label htmlFor="name">Password</label>
                </div>
                <div className="relative w-full">
                  <input name='password' type={passopen === false ? 'text' : 'password'} className='border  border-zinc-500 w-full font-[500]  outline-none p-3 rounded-2xl' placeholder='Enter Your Password' value={formData.password} onChange={handleInputChange} />
                  {passopen ? <IoIosEyeOff size={25} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={passwordOnOff} /> : <IoIosEye size={25} className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={passwordOnOff} />}

                </div>
              </div>
              <div className="flex pt-4 gap-2 w-full">
                <button className='flex w-full p-2 rounded-xl justify-center  bg-zinc-900 hover:bg-zinc-800 cursor-pointer text-white items-center gap-2'>Login <FaLocationArrow color='white' /> </button>
              </div>
              <div className="flex pt-4 gap-2 w-full">
                          Not have an account ? <Link to='/register' className='underline'>Singup</Link>
                      </div>
            </form>
          </div>
          <div className="right-box w-[45vw] h-[100%]  flex flex-col justify-center ">
            <img src={illustration} className='w-full h-full object-cover rounded-2xl ' alt="" />
          </div>
 
    

         
        </div>
      </div>
    )
  }

  export default Login
