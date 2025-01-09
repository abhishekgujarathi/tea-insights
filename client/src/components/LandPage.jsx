import React from "react"
import LandImg from '../assets/landimg.jpg'
import { useState } from "react";
import FileUploadComponenet from "./FileUploadComponent";

function LandPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = (success) => {
    if (success) {
      console.log('File upload was successful');
    }
  };
  return (
    <div className="bg-white py-16 px-8 pt-[120px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Uncover Social Media Insights Effortlessly<span className="text-blue-600"></span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Boost your engagement strategies with AI-powered analytics. Gain valuable insights to grow your audience and optimize your social media performance effortlessly.
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900" onClick={handleOpenModal}>
              Get Started
            </button>
            
            <button className="bg-white text-black border border-black px-6 py-3 rounded-lg shadow hover:bg-gray-100">
              View Demo
            </button>
          </div>
        </div>
        <div>
          <img src={LandImg} alt="" />
        </div>
      </div>
      <FileUploadComponenet
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onUploadSuccess={handleUploadSuccess}
            />
    </div>
  );
};

export default LandPage
