import React, { useState } from 'react'
import { FaLink, FaLocationArrow, FaPray } from "react-icons/fa";
import { MdSubtitles } from "react-icons/md";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { MdDescription } from "react-icons/md";
import { LiaHashtagSolid } from "react-icons/lia";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from 'axios';

import { Bounce, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
const LinkModal = ({ isClicked, setIsClicked }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        tags: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
    console.log(token);
    if (!token) {
        console.error("Token is missing");
        return;
    }
        const payload = {
            title: formData.title,
            url: formData.url,
            description: formData.description,
            tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()) : [],
        };
    
        console.log("Sending Data:", payload); 
    
        try {
            const response = await axios.post(
                "https://favourite-link-setter-backend.onrender.com/links/createLink",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
    
            console.log("Response:", response.data);
            toast.success("Successfully Created")
            setTimeout(()=>{
                window.location.reload()
            },[3000])
        } catch (error) {
            console.error("Axios Error:", error.response ? error.response.data : error);
        }
    };
    
    
    return (
        <div className='h-screen z-50 w-screen  fixed top-0 left-0 bg-[#00000082]'>
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
            <div className="absolute linkmodal rounded-2xl shadow-2xl p-2 border-4 border-white  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] min-h-[60%] bg-black">
                <div className="flex items-center gap-2 p-3 bg-black   rounded-2xl">
                    <FaLink color='white' size={40} />
                    <h1 className=' text-white text-[2vw] '> Create New link</h1>
                </div>
                <form onSubmit={handleSubmit} className='bg-black mt-2 rounded-2xl '>
                    <div className="flex flex-col gap-3 p-2">
                        <div className="relative">
                            <input type="text" className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your title' name='title' value={formData.title} onChange={handleInputChange} />
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <MdSubtitles color='white' size={30} />
                            </div>
                        </div>
                        <div className="relative">
                            <input type="url" className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your Url' name='url' value={formData.url} onChange={handleInputChange} />
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <PiBracketsCurlyBold color='white' size={30} />
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                type="text"
                                className="outline-none w-full border resize-none pl-12 pr-4 py-3 border-zinc-800 rounded-2xl text-white bg-transparent placeholder:text-zinc-400"
                                placeholder="Enter Your Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                            <div className="absolute left-3 top-3  flex items-center">
                                <MdDescription color="white" size={30} />
                            </div>
                        </div>

                        <div className="relative">
                            <input type="text" className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your Tags' name='tags' value={formData.tags} onChange={handleInputChange} />
                            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                <LiaHashtagSolid color='white' size={30} />
                            </div>
                        </div>
                    </div>
                    <div className="mt-2">
                        <button className=' bg-zinc-950 mybutton border border-zinc-600 cursor-pointer text-white flex justify-center items-center gap-2 text-[1.5vw] w-full rounded-2xl p-1'><FaLocationArrow /> Create Link</button>
                    </div>
                </form>
                <div className="closebutton absolute top-5 right-4" onClick={() => setIsClicked(false)} >
                    <RiCloseCircleFill color='white' size={30} />
                </div>
            </div>
        </div>
    )
}

export default LinkModal
