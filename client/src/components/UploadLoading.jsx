import React, { useState, useEffect } from "react";

const LoadingAnimation = () => {
  const messages = [
    "Reading data...",
    "Uploading to AstraDB...",
    "Wait until finished...",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Change message every 1.5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
        <div className="flex justify-center mb-4">
          {/* Add a spinner or progress indicator */}
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {messages[currentMessageIndex]}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we process your request.
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
