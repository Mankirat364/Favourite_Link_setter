import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinkCard from "./LinkCard";

const Browse = () => {
  const [linkData, setLinkData] = useState([]);

  const getAlllink = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found");
      toast.error("Authentication token missing.");
      return;
    }

    try {
      const response = await axios.get("https://favourite-link-setter-backend.onrender.com/links/allLink", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data?.BrowseLink) {
        setLinkData(response.data.BrowseLink);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to load links.");
    }
  };

  useEffect(() => {
    getAlllink();
  }, []);

  console.log(linkData);

  return (
    <div className="text-white">
      <ToastContainer position="top-right" autoClose={3000} transition={Bounce} />
      <div className="pt-2">
        <h1 className="text-[1.5vw] font-[500] mytext">Check Others' Favorite Links.</h1>
      </div>
      <div className="tags flex whitespace-nowrap overflow-auto pt-4 gap-1 w-full">
        {Array.isArray(linkData) && linkData.length > 0 ? (
          linkData.map((item, index) => (
            <div key={index} className="text-white bg-zinc-800 px-4 py-2 rounded-full">
              {item.tags}
            </div>
          ))
        ) : (
          <p className="text-gray-400">No links found.</p>
        )}
      </div>
      <div className="flex items-center mt-5 max-h-[80vh] overflow-auto flex-wrap gap-2">
      {Array.isArray(linkData) && linkData.length > 0 ? (
          linkData.map((item, index) => (
               <LinkCard key={index} isbrowseTab={false} link_id={item._id} link={item} />
       
          ))
        ) : (
          <p className="text-gray-400">No links found.</p>
        )}
      </div>
    </div>
  );
};

export default Browse;
