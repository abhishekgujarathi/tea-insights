import React, { useState, useEffect } from "react";

// const SERVER_HOSTED_API = "http://192.168.1.12:3000";
const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

const SummaryStats = ({ sessionCollectionName }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch summary using the provided `getSummery` function
  const getSummery = async () => {
    try {
      console.log("Loading start");

      const response = await fetch(`${SERVER_HOSTED_API}/get-summery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          collectionName: sessionCollectionName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result) {
        console.log(data.result);
        setSummary(data.result); // Set the summary to state
      } else {
        console.error("No result found in response.");
        throw new Error("No result found in response.");
      }

      console.log("Loading end");
    } catch (err) {
      const errorMessage =
        err.message || "Error getting summary (server error)";
      setError(errorMessage);
      console.error("Error getting summary:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSummery();
  }, [sessionCollectionName]);

  if (loading) {
    return <div className="loading">Getting summary and stats...</div>;
  }

  if (error) {
    return <div className="error">Error in getting summary: {error}</div>;
  }

  return (
    <div className="chatgpt-ui bg-white text-gray-950 p-6 h-fit">
      <div className="response text-lg leading-relaxed p-[35px] rounded-lg border-2 mx-[25px] h-fit">
        <h2 className="text-2xl font-bold mb-6">Post Engagement Summary</h2>
  
        {/* Summary Section */}
        {summary && (
          <div className="mb-6">
            <h3 className="font-semibold text-xl mb-2">Summary of Post Types</h3>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(summary).map(([postType, data], index) => (
                <div key={index} className="border p-4 rounded-md shadow-md">
                  <h4 className="font-semibold">{postType}</h4>
                  <ul className="space-y-2">
                    {Object.entries(data).map(([metric, value], i) => (
                      <li key={i}>
                        <strong>{metric}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
  
        {/* Insights Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-xl mb-2">Key Insights</h3>
          <ul className="space-y-3">
            {insights && insights.map((insight, index) => (
              <li key={index} className="border-l-4 border-blue-600 pl-4">{insight}</li>
            ))}
          </ul>
        </div>
  
        {/* Recommendations Section */}
        <div>
          <h3 className="font-semibold text-xl mb-2">Recommendations</h3>
          <ul className="space-y-3">
            {recommendations && recommendations.map((recommendation, index) => (
              <li key={index} className="border-l-4 border-green-600 pl-4">{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
