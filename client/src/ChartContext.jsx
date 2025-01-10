import React, { createContext, useState } from "react";

const ChartContext = createContext();

export const ChartProvider = ({ children }) => {
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);

  const [postTypeTotals, setPostTypeTotals] = useState({});
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [session, setSession] = useState("");

  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const [askError, setAskError] = useState(null);

  return (
    <ChartContext.Provider
      value={{
        fileContent,
        setFileContent,
        error,
        setError,
        postTypeTotals,
        setPostTypeTotals,
        totalLikes,
        setTotalLikes,
        totalComments,
        setTotalComments,
        totalShares,
        setTotalShares,
        summary,
        setSummary,
        summaryError,
        setSummaryError,
        askError,
        setAskError,
        session,
        setSession,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export default ChartContext;
