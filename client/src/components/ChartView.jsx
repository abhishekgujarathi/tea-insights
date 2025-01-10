import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import axios from "axios";
import Charts from "./Charts";
import SummaryStats from "./SummaryStats";
import ChatApp from "./ChatApp";
import PreviewTable from "./DataCSVTable";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import ChartContext from "../ChartContext";

// const SERVER_HOSTED_API = "http://192.168.1.12:3000";
const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

const ChartView = ({ sessionCollectionName, removeSession }) => {
  // const [fileContent, setFileContent] = useState(null);

  // const [fileContent, setFileContent] = useState(true);
  // const [error, setError] = useState(null);

  // const [summery, setSummery] = useState(null);
  // const [errorSummery, setErrorSummery] = useState(null);

  // const [askError, setAskError] = useState(null);

  // const [postTypeTotals, setPostTypeTotals] = useState({});
  // const [totalLikes, setTotalLikes] = useState(0);
  // const [totalComments, setTotalComments] = useState(0);
  // const [totalShares, setTotalShares] = useState(0);

  const navigate = useNavigate()

  const {
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
    session,
  } = useContext(ChartContext);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`${SERVER_HOSTED_API}/fetch-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent, collectionName: session }), // Correctly stringify the body
          credentials: "include",
        });

        // Check if response status is OK
        if (response.ok) {
          const data = await response.json();
          setFileContent(data.fileContent || []); // Update state with file content
          setPostTypeTotals(data.postTypeTotals || {});
          setTotalLikes(data.totalLikes || 0);
          setTotalComments(data.totalComments || 0);
          setTotalShares(data.totalShares || 0);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch file content");
        }
      } catch (err) {
        setError("Error fetching file content");
        console.error("Error fetching file:", err);
      }
    };

    if (sessionCollectionName) {
      fetchFile(); // Call fetchFile if sessionCollectionName is available
    }
  }, [sessionCollectionName]); // Dependency array

  const askQuestionHandler = async () => {
    alert("askQuestionHandler");
    return;
    try {
      const response = await fetch(
        `${SERVER_HOSTED_API}/question-choice`,
        { sessionCollectionName },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
    } catch {
      setError("Error in response");
      console.error("Error in response:", err);
    }
  };

  const handleReUpload = () => {
    // removeSession(false);
    navigate("/"); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!fileContent) {
    return <div>Loading file content...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-950 pt-[100px] w-full">
      <Helmet>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          rel="stylesheet"
        />
      </Helmet>
      {/* Summary and Question List */}
      
      <div className="flex flex-col justify-evenly">
        <div className="flex flex-col p-4 bg-white text-gray-950 w-full h-fit">
          {/* Chart Container */}
          <div className="flex flex-col justify-center items-center w-full min-w-screen h-fit">
            <div className="w-full h-[400px] ">
              <Charts
                postTypeTotals={postTypeTotals}
                totalLikes={totalLikes}
                totalComments={totalComments}
                totalShares={totalShares}
              />
            </div>

            <div className="bg-white text-gray-950 h-fit max-h-fit">
              <SummaryStats sessionCollectionName={sessionCollectionName} />
            </div>
            <div className="bg-white text-gray-950 h-fit max-h-fit w-full">
              <PreviewTable fileData={fileContent} />
            </div>
          </div>
        </div>
        {/* Chat App */}
        <div className="flex flex-col flex-grow ">
          <button
            className="fixed bottom-6 right-6 bg-black hover:bg-gray-300 text-white font-bold h-12 w-12 rounded-full shadow-lg text-xl "
            onClick={() => document.getElementById("my_modal_5").showModal()}
            title="Chat"
          >
            <i className="fas fa-comment-dots"></i>
          </button>

          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle "
          >
            <div className="modal-box p-4 w-[90vw] min-w-[90vw] h-[90vh] flex flex-col overflow-hidden bg-[#2a2a2a]">
              <div className="modal-action m-1">
                <form
                  method="dialog"
                  onSubmit={(event) => {
                    event.preventDefault(); // Prevent form refresh
                    const dialog = document.getElementById("my_modal_5"); // Get the dialog element
                    dialog.close(); // Close the dialog
                    console.log("Form submission prevented!");
                  }}
                >
                  <button className="btn px-4 py-0 m-0 hover:bg-black hover:text-white">
                    X
                  </button>
                </form>
              </div>

              <div className="flex flex-col flex-grow h-full">
                <ChatApp sessionCollectionName={sessionCollectionName} />
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
ChartView.propTypes = {
  sessionCollectionName: PropTypes.string.isRequired, // Ensure sessionCollectionName is a required string
};

export default ChartView;
