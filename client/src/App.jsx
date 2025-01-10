import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Preview from "./components/Preview";
import Home from "./components/Home";

import ChartContext, { ChartProvider } from "./ChartContext";

// const SERVER_HOSTED_API="http://192.168.1.12:3000"
// const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

function App() {
  return (
    <ChartProvider>
      <Router>
        <Routes>
          {/* Define routes for each component */}
          <Route path="/" element={<Home />} />
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </Router>
    </ChartProvider>
  );
}

export default App;
