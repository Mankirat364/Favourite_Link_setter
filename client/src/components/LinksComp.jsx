import React, { useEffect, useState } from "react";
import Button from "./Button";
import { IoLogOutOutline } from "react-icons/io5";
import { IoShareSocialSharp } from "react-icons/io5";
import LinkModal from "./LinkModal";
import LinkCard from "./LinkCard";
import { GoPlusCircle } from "react-icons/go";
import axios from "axios";
import { IoSearchOutline } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const LinksComp = ({ user, googleuser }) => {
  const [linkdata, setLinkData] = useState({ links: [] });
  const [highlightedValues, setIshighlightedValues] = useState([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([]);
  const getData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const reponse = await axios.get('http://localhost:3000/links/link', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      setLinkData(reponse.data)


    } catch (error) {
      console.error(error)
    }
  }
  console.log(linkdata);
  useEffect(() => {
    getData()
  }, [])
const handleLogout = async() =>{
    try {
      const response = await axios.delete('http://localhost:3000/user/logout',{
        withCredentials: true,
      })
      localStorage.clear('authToken');
    
      toast.success('user logged out sucessfull')
      setTimeout(()=>{
          window.location.reload()
      },[])
    } catch (error) {
      toast.error(error)
    }
}
  const handleSearch = (e) => {
    setIsSearchOpen(true)
    const value = e.target.value.toLowerCase();
    setIshighlightedValues(value)
    if (value === "") {
      setIsSearchOpen(false);
      setSearchResults([]);
      return;
    }
    const filteredLinks = linkdata.links.filter((item) =>
      item.title.toLowerCase().includes(value)
    );
    setSearchResults(filteredLinks);
    setIsSearchOpen(true);
  }
  const userTag = user?.username?.charAt(0).toUpperCase();
  const [isClicked, setIsClicked] = useState(false)
  return (
    <div className="relative h-full text-white">
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
      <div className="flex items-center justify-between">
        <h1 className="text-[2vw] mytext  font-[500]">
          Welcome Back,{" "}
          <span className="capitalize">
            {googleuser ? googleuser.name : user?.username}!
          </span>
        </h1>

        <div className="flex items-center gap-2">
          <div onClick={handleLogout}>

          <Button
            title="logout"
            styles="bg-[#151515] border border-zinc-700 text-white px-5 py-2 transition-all duration-300 ease-in-out hover:bg-gray-800 hover:scale-105 hover:shadow-lg cursor-pointer flex items-center gap-2 capitalize rounded-xl"
            icon={<IoLogOutOutline size={20} />}
        
            />
</div>
          {googleuser ? (
            <img
              src={googleuser.picture}
              alt="User Profile"
              className="w-10 bg-[#151515] border border-zinc-700 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-[#151515] border border-zinc-700 flex rounded-full uppercase items-center justify-center text-white">
              <h1>{userTag}</h1>
            </div>
          )}
        </div>
      </div>
      <div className="relative h-fit pt-5">
        <input
          type="text"
          placeholder="Search your fav link"
          className="w-full border border-zinc-700 bg-[#0a0a0a] p-3 pr-12 rounded-xl outline-none text-white"
          onChange={handleSearch}
        />
        <IoSearchOutline
          size={24}
          className="absolute mt-2 right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <div className={isSearchOpen ? "absolute top-[90%] rounded-br-xl rounded-bl-xl w-full z-10 bg-[#212121]  min-h-[12vh]  transition-all ease-linear shadow-[#272727] shadow-2xl " : "absolute top-[90%] rounded-br-xl rounded-bl-xl w-full z-10 bg-[#2e2e2e]  h-[0vh] transition-all ease-linear"}>
          {isSearchOpen && searchResults.length > 0 ? (
            searchResults.map((item, index) => {
              const regex = new RegExp(`(${highlightedValues})`, "gi");
              const highlightedTitle = item.title.replace(regex, (match) =>
                `<span class="bg-yellow-500 text-black px-1 rounded">${match}</span>`
              );

              return (
                <p
                  className="border-b p-3 hover:bg-[#2e2e2e] border-b-zinc-700"
                  key={index}
                  dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                ></p>
              );
            })
          ) : (
            isSearchOpen && <p className="text-gray-400 text-center">No results found</p>
          )}

        </div>

      </div>


      <div className="pt-5">
        <div className="flex items-center max-h-[80vh] overflow-auto flex-wrap gap-2">
          {[...(isSearchOpen && searchResults.length > 0 ? searchResults : linkdata?.links || [])]
            .slice()
            .reverse()
            .map((link, index) => (
              <LinkCard user={linkdata.user} key={index} isbrowseTab={true} link_id={link._id} link={link} />
            ))}

        </div>
      </div>

      <div onClick={() => setIsClicked(true)} className="absolute px-4 py-2 rounded-xl bg-[#151515] border border-zinc-700 text-white flex items-center gap-2 bottom-0 right-0">
        <p>Add Link</p>
        <GoPlusCircle size={25} />
      </div>
      {isClicked && (<LinkModal isClicked={isClicked} setIsClicked={setIsClicked} />)}
    </div>
  );
};

export default LinksComp;
