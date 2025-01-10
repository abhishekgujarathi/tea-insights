import React, { useContext, useEffect, useState } from "react";
import FileUploadComponent from "./FileUploadComponent";
import ChartView from "./ChartView";
import ChatApp from "./ChatApp";
import NavBar from "./NavBar";

import ChartContext from "../ChartContext";

// const SERVER_HOSTED_API = "http://192.168.1.12:3000";
const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

function Preview() {
  const { session, fileContent } = useContext(ChartContext);

  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  // const [session, setSession] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${SERVER_HOSTED_API}/test-session-set`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
          body: JSON.stringify({
            collectionName: session,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("preview :: ", data);
          setSession(data.collectionName);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch session.");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchSession();
  }, []); // Empty dependency array ensures it runs only once

  const handleUploadSuccess = () => {
    setIsUploadSuccessful(true);
  };

  console.log("The file content:", fileContent);

  return (
    <div>
      <NavBar />
      <p>Session: {session}</p>
      <ChartView sessionCollectionName={session} />
    </div>
  );
}

export default Preview;
