import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Bar, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the scales and elements explicitly
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Charts({
  postTypeTotals = {},
  totalLikes = 0,
  totalComments = 0,
  totalShares = 0,
}) {
  const postTypes = ["carousel", "reel", "post"]; // Categories of posts
  console.log(postTypeTotals);
  // Prepare data for grouped bar chart
  const barChartData = {
    labels: postTypes,
    datasets: [
      {
        label: "Likes",
        data: postTypes.map((type) => postTypeTotals[type]?.likes || 0),
        backgroundColor: "#000000",
        borderRadius: 5,
      },
      {
        label: "Comments",
        data: postTypes.map((type) => postTypeTotals[type]?.comments || 0),
        backgroundColor: "#454545",
        borderRadius: 5,
      },
      {
        label: "Shares",
        data: postTypes.map((type) => postTypeTotals[type]?.shares || 0),
        backgroundColor: "#8A8A8A",
        borderRadius: 5,
      },
    ],
  };

  // Options for the bar chart
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart data
  const doughnutChartData = {
    labels: ["Likes", "Comments", "Shares"],
    datasets: [
      {
        data: [totalLikes, totalComments, totalShares],
        backgroundColor: ["#000000", "#454545", "#8A8A8A"],
      },
    ],
  };

  // Options for the doughnut chart
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="w-full m-0 h-full p-10">
      <div className="flex flex-row justify-center gap-20 w-full min-w-min h-full">
        {/* Grouped Bar Chart */}
        <div className="bar-chart mb-4 w-6/12 h-full">
          {/* <div className="h-full flex flex-col border-2 border-gray-200 p-[35px] rounded-lg "> */}
        <div className="w-full h-full flex flex-col border-2 border-gray-200 rounded-lg pt-4">
            <div className="text-center font-bold text-xl">
              All Post Types Data
            </div>
            <div className="doughnut-chart w-full h-full flex flex-col pb-5 pr-5 pl-5">
              <Bar
                className="h-full"
                data={barChartData}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
        {/* Doughnut Chart for Overall totals */}
        <div className="w-4/12 h-full flex flex-col border-2 border-gray-200 rounded-lg p-4">
          <div className="text-center font-bold text-xl">
            All Post Types Data
          </div>
          <div className="flex-grow doughnut-chart w-full h-full flex flex-col pb-5 pr-5 pl-5">
            {/* <div className="text-center font-bold text-xl">Overall Counts</div> */}
            <Doughnut
              className=""
              data={doughnutChartData}
              options={doughnutChartOptions}
            />
          </div>
                  
        </div>
      </div>
    </div>
  );
}
// PropTypes for validation
Charts.propTypes = {
  postTypeTotals: PropTypes.object.isRequired, // Ensures object prop is passed
  totalLikes: PropTypes.number.isRequired,
  totalComments: PropTypes.number.isRequired,
  totalShares: PropTypes.number.isRequired,
};

export default Charts;
