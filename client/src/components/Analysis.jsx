import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Analysis = () => {
  const [linkdata, setLinkData] = useState([]);

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

  const totalLinks = linkdata.length;
  const categoryCounts = { YouTube: 0, Instagram: 0, Twitter: 0, Other: 0 };
  
  linkdata.forEach((link) => {
    if (link.url.includes("youtube.com") || link.url.includes("youtu.be")) {
      categoryCounts.YouTube++;
    } else if (link.url.includes("instagram.com")) {
      categoryCounts.Instagram++;
    } else if (link.url.includes("twitter.com") || link.url.includes("x.com")) {
      categoryCounts.Twitter++;
    } else {
      categoryCounts.Other++;
    }
  });

  const tagCounts = {};
  linkdata.forEach((link) => {
    link.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const tagLabels = Object.keys(tagCounts);
  const tagValues = Object.values(tagCounts);

  return (
    <div className=" text-white p-4 rounded-lg shadow-md max-h-[91vh] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">📊 Analysis Dashboard</h2>

      <div className="bg-zinc-950 border-zinc-700 border p-4 rounded-lg text-center mb-6">
        <h3 className="text-2xl font-bold">{totalLinks}</h3>
        <p className="text-gray-400">Total Links</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Link Distribution by Platform</h3>
        <Doughnut
          data={{
            labels: ["YouTube", "Instagram", "Twitter", "Other"],
            datasets: [
              {
                data: Object.values(categoryCounts),
                backgroundColor: ["#FF0000", "#E1306C", "#1DA1F2", "#888888"],
              },
            ],
          }}
        />
      </div>

      {tagLabels.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Tags Distribution</h3>
          <Bar
            data={{
              labels: tagLabels,
              datasets: [
                {
                  label: "Tag Usage",
                  data: tagValues,
                  backgroundColor: "#4CAF50",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Analysis;
