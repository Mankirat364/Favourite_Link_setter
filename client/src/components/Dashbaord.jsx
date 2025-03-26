import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [linkData, setLinkData] = useState([]);

  const getData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const response = await axios.get("https://favourite-link-setter-backend.onrender.com/links/link", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setLinkData(response.data.links);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getLinkType = (url) => {
    if (url.includes("youtube.com")) return "YouTube";
    if (url.includes("instagram.com")) return "Instagram";
    if (url.includes("twitter.com") || url.includes("x.com")) return "X";
    return "Other";
  };

  const linkTypes = linkData.reduce((acc, link) => {
    const type = getLinkType(link.url);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: linkData.map((link) => link.title),
    datasets: [
      {
        label: "Number of Links",
        data: linkData.map((_, index) => index + 1),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(linkTypes),
    datasets: [
      {
        data: Object.values(linkTypes),
        backgroundColor: ["#FF0000", "#E1306C", "#1DA1F2", "#6B7280"],
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Links over Time",
        data: linkData.map((link, index) => ({
          x: new Date(link.createdAt).getTime(),
          y: index + 1,
        })),
        backgroundColor: "#F59E0B",
      },
    ],
  };

  return (
    <div className="p-6 text-white min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>
      <div className="w-full max-w-4xl space-y-8 h-[80vh] overflow-auto">
        {linkData.length > 0 ? (
          <>
            <div className="bg-zinc-800 p-6 shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">Number of Links</h2>
              <Bar data={barData} />
            </div>
            <div className="bg-zinc-800 p-6 shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">Types of Links</h2>
              <Pie data={pieData} />
            </div>
            <div className="bg-zinc-800 p-6 shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">Links Over Time</h2>
              <Scatter data={scatterData} />
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-600">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
