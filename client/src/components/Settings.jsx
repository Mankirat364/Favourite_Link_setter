import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import { Bounce, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
const Settings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    const getUserIdFromToken = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.userId;
        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    };
    const token = localStorage.getItem("authToken");
    const userId = getUserIdFromToken(token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/user/update/${userId}`, formData, {
                withCredentials: true
            })
            console.log(response.data);
            toast.success('Credentials Updated Sucessfully');
        } catch (error) {
            console.error(error)
            toast.success(error)
        }
    }
    return (
        <div className="max-w-lg mx-auto p-8  bg-zinc-900 shadow-xl rounded-2xl mt-10 border border-zinc-700">
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
            <h2 className="text-3xl font-bold text-center text-zinc-500 mb-6">Account Settings</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                    <FaUser className="absolute left-3 top-4 text-gray-500" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-zinc-700 text-white outline-none rounded-lg  shadow-sm"
                        placeholder="Enter new username"
                        name="username"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-4 text-gray-500" />
                    <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-zinc-700 text-white outline-none rounded-lg  shadow-sm"
                        placeholder="Enter new email"
                        name="email"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="relative">
                    <FaLock className="absolute left-3 top-4 text-gray-500" />
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-3 border border-zinc-700 text-white outline-none rounded-lg  shadow-sm"
                        placeholder="Enter new password"
                        name="password"
                        onChange={handleInputChange}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default Settings;
