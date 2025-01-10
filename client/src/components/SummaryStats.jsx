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

  const renderSummaryContent = (text) => {
    return text.split("\n").map((line, index) => {
      // For bullet points
      if (line.startsWith("-")) {
        const formattedLine = line
          .substring(2) // Remove the leading "- "
          .replace(/\*\*(.*?)\*\-/g, "<strong>$1</strong>"); // Replace **text** with <strong>text</strong>
        
        return (
          <div
            key={index}
            className="summary-item mb-4 p-4 border-l-4 border-blue-600 bg-gray-100 text-gray-950 rounded-md"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      } 
      // For section headers (###)
      else if (line.startsWith("###")) {
        const formattedLine = line
          .substring(4) // Remove the leading "### "
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Replace **text** with <strong>text</strong>
        return (
          <h3
            key={index}
            className="text-xl font-semibold mb-3 text-gray-800"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      } 
      // For standalone bold text
      else if (line.startsWith("**")) {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <p key={index} className="font-bold text-gray-950 mb-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      } 
      // For other general text
      else {
        return (
          <p key={index} className="text-gray-700 mb-2">{line}</p>
        );
      }
    });
  };
  
  if (loading) {
    return <div className="loading">Getting summary and stats...</div>;
  }
  
  if (error) {
    return <div className="error">Error in getting summary: {error}</div>;
  }
  
  return (
    <div className="chatgpt-ui bg-white text-gray-950 p-6">
      <div className="response text-lg leading-relaxed p-[35px] rounded-lg border-2 mx-[25px] h-fit">
        <h2 className="text-2xl font-bold mb-6">Post Engagement Summary</h2>
  
        {summary && renderSummaryContent(summary)}
  
        <div className="separator my-6 border-b border-gray-300" />
        
      </div>
    </div>
  );
};

export default SummaryStats;
