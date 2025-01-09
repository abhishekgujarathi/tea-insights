import React, { useState, useEffect } from "react";

const SERVER_HOSTED_API = "http://192.168.1.12:3000";

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
        <h2 className="text-2xl font-bold mb-4 h-fit">
          Post Engagement Summary
        </h2>
        {summary &&
          summary.split("\n").map((line, index) => {
            if (line.startsWith("* ")) {
              const formattedLine = line
                .substring(2)
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
              return (
                <div
                  key={index}
                  className="mb-2 p-4 border-l-4 border-black bg-gray-300 text-gray-950 rounded-md"
                  dangerouslySetInnerHTML={{ __html: formattedLine }}
                />
              );
            } else {
              const formattedLine = line.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              );
              return (
                <p
                  key={index}
                  className="mb-4 bg-white text-gray-950"
                  dangerouslySetInnerHTML={{ __html: formattedLine }}
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default SummaryStats;
