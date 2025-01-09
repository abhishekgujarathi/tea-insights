import React, { useEffect, useState } from "react";
import FileUploadComponent from "./FileUploadComponent";
import ChartView from "./ChartView";
import ChatApp from "./ChatApp";
import NavBar from "./NavBar";

const SERVER_HOSTED_API = "http://192.168.1.12:3000";

function Preview() {
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [session, setSession] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${SERVER_HOSTED_API}/test-session-set`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
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

  return (
    <div>
      <NavBar />
      <ChartView sessionCollectionName={session} />
    </div>
  );
}

export default Preview;
