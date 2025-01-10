import React, { useState, useEffect } from "react";
import LandPage from "./LandPage";
import NavBar from "./NavBar";
import Works from "./Works";
import Team from "./Team";

const SessionTestComponent = () => {
  const [sessionStatus, setSessionStatus] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    const setSession = async () => {
      try {
        // Make the first fetch request to set the session
        const response = await fetch(
          "http://tea-insights-api.vercel.app/test-session-set",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Include credentials to maintain session
          }
        );

        const data = await response.json();
        if (response.ok) {
          console.log("Session set successfully:", data);
          setSessionStatus("Session set successfully.");
          // Once session is set, proceed with upload test
          await uploadFileTest();
        } else {
          setSessionStatus("Failed to set session.");
        }
      } catch (error) {
        setSessionStatus("Error setting session: " + error.message);
        console.error("Error setting session:", error);
      }
    };

    const uploadFileTest = async () => {
      try {
        // Make the second fetch request to upload file
        const uploadResponse = await fetch(
          "https://tea-insights-api.vercel.app/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Pass the content to upload (for testing purposes, you can pass a dummy file content or test data)
              fileContent: "dummy file content for testing",
            }),
            credentials: "include", // Ensure session is maintained
          }
        );

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          console.log("Upload successful:", uploadData);
          setUploadStatus("Upload successful: " + uploadData.message);
        } else {
          setUploadStatus("Upload failed: " + uploadData.error);
        }
      } catch (error) {
        setUploadStatus("Error uploading file: " + error.message);
        console.error("Error uploading file:", error);
      }
    };

    // Trigger the session setup on component mount
    setSession();
  }, []);

  return (
    <div>
      <h2>Session and Upload Test</h2>
      <p>{sessionStatus}</p>
      <p>{uploadStatus}</p>
    </div>
  );
};

function Home() {
  return (
    <>
      <SessionTestComponent />
      <NavBar />
      <LandPage />
      <Works />
      <Team />
    </>
  );
}

export default Home;
