import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Preview from "./components/Preview";
import Home from "./components/Home";

import { ChartProvider } from "./ChartContext";


const SERVER_HOSTED_API="http://192.168.1.12:3000"

function App() {
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
    <ChartProvider>
    <Router>
      <Routes>
        {/* Define routes for each component */}
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<Preview session={session}/>} />
      </Routes>
    </Router>
    </ChartProvider>
  );
}

export default App;
