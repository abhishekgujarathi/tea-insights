import React, { useContext, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LoadingAnimation from "./UploadLoading";
import ChartContext from "../ChartContext";

// const SERVER_HOSTED_API = "http://192.168.1.12:3000";
const SERVER_HOSTED_API = "https://tea-insights-api.vercel.app";

const FileUploadComponent = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigation hook

  const { fileContent, setFileContent, session } = useContext(ChartContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);

    if (!file) {
      alert("Please select a file first.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Directly append the file from the state

    // Optionally, add additional JSON data to the form
    formData.append(
      "jsonData",
      JSON.stringify({
        collectionName: session,
      })
    );

    try {
      const response = await fetch(`${SERVER_HOSTED_API}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Allow cookies to be sent with the request
      });

      console.log("Express response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert("Some error occurred. Please refresh and reupload.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      console.log("File upload success:", data);
      setFileContent(data.fileContent);
      alert(`File uploaded successfully: ${data.message}`);
      setIsLoading(false);

      // Redirect to another page on success
      navigate("/preview"); // Update with your route path
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Some error occurred. Please refresh and reupload.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full text-gray-800 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upload Your CSV File</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <FiUpload className="text-6xl text-black" />
            <p className="mt-2 text-sm text-gray-500">Accepted format: .csv</p>
            <input
              type="file"
              accept=".csv"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex gap-[20px]">
              <label
                htmlFor="fileInput"
                className="cursor-pointer mt-4 px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-700 transition"
              >
                {file ? `${file.name}` : "Choose File"}
              </label>
              <button
                onClick={handleUpload}
                className="mt-4 px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-700 transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUploadComponent;
