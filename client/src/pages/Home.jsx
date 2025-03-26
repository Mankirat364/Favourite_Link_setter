import React, { useEffect, useState } from 'react';
import { SiHomeadvisor } from "react-icons/si";
import { RiDashboard2Fill } from "react-icons/ri";
import { PiBrowsersFill } from "react-icons/pi";
import { FaUserCog, FaBars, FaTimes, FaChartLine } from "react-icons/fa";
import LinksComp from '../components/LinksComp';
import Analysis from '../components/Analysis';
import Dashbaord from '../components/Dashbaord';
import Browse from '../components/Browse';
import Settings from '../components/Settings';

const Home = () => {
  const [user, setUser] = useState(null);
  const [user1, setUser1] = useState(null);
  const [path, selectPath] = useState('Home');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUser1 = localStorage.getItem('User1');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedUser1) setUser1(JSON.parse(storedUser1));
  }, []);

  const sidebarItems = [
    { name: "Home", icon: <SiHomeadvisor size={35} /> },
    { name: "Dashboard", icon: <RiDashboard2Fill size={35} /> },
    { name: "Browse", icon: <PiBrowsersFill size={35} /> },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Mobile Header - Only shows on mobile */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-black rounded-xl mb-2 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-white p-2 rounded-lg bg-zinc-800"
          >
            {showSidebar ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="logo text-white">
            <h1 className="text-2xl">FL</h1>
          </div>
        </div>
        <button 
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="text-white p-2 rounded-lg bg-zinc-800"
        >
          {showAnalysis ? <FaTimes size={20} /> : <FaChartLine size={20} />}
        </button>
      </div>

      {/* Desktop Layout - Exactly as before */}
      <div className="hidden lg:grid grid-cols-11 p-2 gap-4 h-screen">
        <div className="col-span-1 bg-black rounded-3xl border-2 border-zinc-700 flex flex-col justify-between items-center py-7">
          <div className="flex flex-col items-center">
            <div className="logo text-white">
              <h1 className="text-[3vw]">FL</h1>
            </div>

            <div className="flex flex-col gap-4 text-white pt-14">
              {sidebarItems.map(({ name, icon }) => (
                <div
                  key={name}
                  className={`flex cursor-pointer flex-col gap-1 items-center ${
                    path === name ? "effect" : ""
                  }`}
                  onClick={() => selectPath(name)}
                >
                  {icon}
                  <p className="text-[1.2vw]">{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`flex flex-col cursor-pointer gap-1 items-center text-white ${
              path === "Settings" ? "effect" : ""
            }`}
            onClick={() => selectPath("Settings")}
          >
            <FaUserCog size={35} />
            <p className="text-[1.2vw]">Settings</p>
          </div>
        </div>

        <div className="col-span-7 border border-zinc-700 bg-[#030303] shadow-xl shadow-black p-4 rounded-2xl">
          {path === "Home" && <LinksComp user={user1} googleuser={user} />}
          {path === "Dashboard" && <Dashbaord />}
          {path === "Browse" && <Browse />}
          {path === "Settings" && <Settings />}
        </div>

        <div className="col-span-3 analysis border p-4 rounded-2xl border-zinc-700 bg-[#030303] shadow-xl shadow-black">
          <Analysis />
        </div>
      </div>

      <div className="lg:hidden">
        {showSidebar && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="bg-black opacity-[40%] flex-1"
              onClick={() => setShowSidebar(false)}
            />
            <div className="w-3/4 h-full bg-black rounded-r-3xl border-2 border-zinc-700 flex flex-col justify-between items-center py-7">
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-4 text-white pt-14 w-full px-4">
                  {sidebarItems.map(({ name, icon }) => (
                    <div
                      key={name}
                      className={`flex cursor-pointer flex-col gap-1 items-center p-3 rounded-xl ${
                        path === name ? "bg-zinc-800" : ""
                      }`}
                      onClick={() => {
                        selectPath(name);
                        setShowSidebar(false);
                      }}
                    >
                      {icon}
                      <p className="text-lg">{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`flex flex-col cursor-pointer gap-1 items-center p-3 rounded-xl text-white ${
                  path === "Settings" ? "bg-zinc-800" : ""
                }`}
                onClick={() => {
                  selectPath("Settings");
                  setShowSidebar(false);
                }}
              >
                <FaUserCog size={35} />
                <p className="text-lg">Settings</p>
              </div>
            </div>
          </div>
        )}

        {showAnalysis && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="w-1/4 bg-black opacity-[40%]"
              onClick={() => setShowAnalysis(false)}
            />
            <div className="w-3/4 h-full ml-auto analysis border-l border-zinc-700 bg-[#030303] shadow-xl shadow-black p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-white">Analysis</h2>
                <button 
                  onClick={() => setShowAnalysis(false)}
                  className="text-white p-1 rounded-full bg-zinc-800"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <Analysis />
            </div>
          </div>
        )}

        <div className="border border-zinc-700 bg-[#030303] shadow-xl shadow-black p-4 rounded-2xl min-h-[80vh] mx-2">
          {path === "Home" && <LinksComp user={user1} googleuser={user} />}
          {path === "Dashboard" && <Dashbaord />}
          {path === "Browse" && <Browse />}
          {path === "Settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Home;