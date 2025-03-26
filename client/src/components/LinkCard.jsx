import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { FaLink, FaLocationArrow } from 'react-icons/fa';
import { IoShareSocialSharp } from "react-icons/io5";
import { LiaHashtagSolid } from 'react-icons/lia';
import { MdDescription, MdSubtitles } from 'react-icons/md';
import { PiBracketsCurlyBold, PiDotsThreeBold } from "react-icons/pi";
import { RiCloseCircleFill } from 'react-icons/ri';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"
const LinkCard = ({ link, link_id,isbrowseTab,user }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleteModal, OpenDeleteModal] = useState(false);
    const menuRef = useRef(null);
    const userFirstCharacter = link?.userId?.username.split('')[0];
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        tags: ''
    })
    console.log(user);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    const [edit, setEdit] = useState(false);
    const convertToEmbedUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes("youtube.com")) return url.replace("watch?v=", "embed/");
            if (parsedUrl.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsedUrl.pathname.split("/")[1]}`;
            if (parsedUrl.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsedUrl.pathname.split("/")[1]}`;
            if (parsedUrl.hostname.includes("twitter.com")) return `https://twitframe.com/show?url=${encodeURIComponent(url)}`;
            if (parsedUrl.hostname.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
            if (parsedUrl.hostname.includes("instagram.com")) return `https://www.instagram.com/p/${parsedUrl.pathname.split("/")[2]}/embed/`;
            return url;
        } catch (error) {
            console.error("Invalid URL:", url);
            return url;
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: link?.title,
                text: link?.description,
                url: link?.url,
            })
                .then(() => console.log("Shared successfully"))
                .catch((error) => console.error("Error sharing:", error));
        } else {
            navigator.clipboard.writeText(link?.url);
            toast.success("Link copied to clipboard! Share it manually.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }

        try {
            const response = await axios.put(
                "https://favourite-link-setter-backend.onrender.com/links/update",
                { ...formData, link_id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            toast.success("Link Updated Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update link");
        }
    };
    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
    
        if (!token) {
            toast.error("Authentication token is missing.");
            return;
        }
    
        try {
            const response = await axios.delete(`https://favourite-link-setter-backend.onrender.com/links/delete/${link_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
    
            toast.success("Link Deleted Successfully");
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete link");
        }
    };
    return (
        <div className='bg-[#111] border border-zinc-700 pt-3 px-3 rounded-2xl mycard w-[49%] min-h-[70vh] relative'>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center capitalize">{userFirstCharacter}</div>
                    <div className="flex flex-col gap-1 text-white">
                        <p className='text-[1.2vw] capitalize mytext '>{link?.userId?.username}</p>
                        <p className='text-[.9vw] text-zinc-600 mt-[-.5vw] mytextemail '>{link?.userId?.email}</p>
                    </div>
                </div>

                {isbrowseTab  && <div className="flex relative items-center text-zinc-400 gap-2">
                    <PiDotsThreeBold size={20} onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer hover:text-zinc-100" />
                    <IoShareSocialSharp size={20} onClick={handleShare} className="cursor-pointer hover:text-zinc-100 transition-all ease-linear" />

                    {menuOpen && (
                        <div ref={menuRef} className="absolute z-10 right-0 top-[100%] mt-2 w-32 bg-zinc-800 text-white rounded-lg shadow-lg">
                            <button onClick={() => setEdit(true)} className="w-full rounded-tr-lg rounded-tl-lg px-4 py-2 hover:bg-zinc-700 text-left">✏️ Edit</button>
                            <button onClick={() => OpenDeleteModal(true)} className="w-full rounded-br-lg rounded-bl-lg px-4 py-2 hover:bg-red-600 text-left">🗑️ Delete</button>
                        </div>
                    )}
                </div>}
            </div>

            <div className="w-full h-[34vh] mt-3 rounded-xl bg-white relative">
                <iframe src={convertToEmbedUrl(link?.url)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className='w-full h-full rounded-xl' frameBorder="0"></iframe>
                <div onClick={() => {
                    navigator.clipboard.writeText(link?.url);
                    toast.success("Successfully copied to clipboard!");
                }} className="absolute overflow-auto w-full h-[4vh] bottom-0 text-[1vw] w-fit h-fit p-2 rounded-2xl backfileter text-white cursor-pointer">
                    <p className="mytext">{link?.url}</p>
                </div>
            </div>

            <div className="title text-zinc-300 text-[1.5vw] pt-3">
                <p className='mytext'>{link?.title}</p>
            </div>
            <div className="description text-zinc-500 pt-3">
                <p>{link?.description}</p>
            </div>

            <div className="flex items-center flex-wrap gap-2 pb-3 pt-2">
                {link?.tags.map((tag, index) => (
                    <div key={index} className="min-w-fit mytextemail2 text-[1vw] min-h-fit px-4 py-2 text-white rounded-xl bg-zinc-800">
                        {tag}
                    </div>
                ))}
            </div>
            {edit && (
                <div className='h-screen z-50 w-screen fixed top-0 left-0 bg-[#00000082]'>
                    <div className="absolute linkmodal rounded-2xl shadow-2xl p-2 border-4 border-white  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] min-h-[60%] bg-black">
                        <div className="flex items-center gap-2 p-3 bg-black   rounded-2xl">
                            <FaLink color='white' size={40} />
                            <h1 className=' text-white text-[2vw] mytext '>Update Your link</h1>
                        </div>
                        <form className='bg-black mt-2 rounded-2xl ' onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-3 p-2">
                                <div className="relative">
                                    <input type="text" name='title' onChange={handleInputChange} className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your title' />
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <MdSubtitles color='white' size={30} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <input type="url" name='url' onChange={handleInputChange} className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your Url' />
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <PiBracketsCurlyBold color='white' size={30} />
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea
                                        type="text"
                                        name='description'
                                        onChange={handleInputChange}
                                        className="outline-none w-full border resize-none pl-12 pr-4 py-3 border-zinc-800 rounded-2xl text-white bg-transparent placeholder:text-zinc-400"
                                        placeholder="Enter Your Description"
                                    />
                                    <div className="absolute left-3 top-3  flex items-center">
                                        <MdDescription color="white" size={30} />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input type="text" className='outline-none w-full border px-11 py-3 border-zinc-800 rounded-2xl text-white' placeholder='Enter Your Tags' name='tags' onChange={handleInputChange} />
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                                        <LiaHashtagSolid color='white' size={30} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <button className=' mybutton bg-zinc-950 border border-zinc-600 cursor-pointer text-white flex justify-center items-center gap-2 text-[1.5vw] w-full rounded-2xl p-1'><FaLocationArrow /> update Link</button>
                            </div>
                        </form>
                        <div className="closebutton absolute top-5 right-4" onClick={() => setEdit(false)}  >
                            <RiCloseCircleFill color='white' size={30} />
                        </div>
                    </div>
                </div>
            )}
            {deleteModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative bg-[#111] p-6 rounded-2xl shadow-lg w-[90%] max-w-md border border-gray-700"
                    >
                        <h2 className="text-white text-xl font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-400 mt-2">
                            Are you sure you want to delete this note? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 rounded-xl text-gray-300 bg-gray-700 hover:bg-gray-600 transition"
                                onClick={() => OpenDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                            onClick={handleDeleteSubmit}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
}

export default LinkCard;
