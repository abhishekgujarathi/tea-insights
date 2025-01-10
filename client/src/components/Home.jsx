import React, { useState, useEffect, useContext } from "react";
import LandPage from "./LandPage";
import NavBar from "./NavBar";
import Works from "./Works";
import Team from "./Team";

import ChartContext, { ChartProvider } from "../ChartContext";

// const SERVER_HOSTED_API = "http://192.168.1.12:3000";
const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

function Home() {
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);
  const [error, setError] = useState("");

  const { session, setSession } = useContext(ChartContext);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${SERVER_HOSTED_API}/test-session-set`, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
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

  return (
    <>
      {/* <SessionTestComponent /> */}
      <NavBar />
      <LandPage />
      <Works />
      <Team />
    </>
  );
}

export default Home;
