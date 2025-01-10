import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import FileUploadComponenet from "./FileUploadComponent";
import logo from "../assets/logo.png";

const NavBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = (success) => {
    if (success) {
      console.log("File upload was successful");
    }
  };

  return (
    <div className="w-full bg-black h-[10vh] max-h-[10vh] flex justify-between items-center px-16 fixed">
      {/* Logo */}
      <Link to="/" className="text-white">
        <img className="h-[8vh]" src={logo} alt="Logo" />
      </Link>

      {/* Conditional Buttons */}
      {location.pathname === "/" ? (
        <button
          className="bg-white text-black px-6 py-2 shadow hover:bg-gray-200"
          onClick={handleOpenModal}
        >
          Get Started
        </button>
      ) : location.pathname === "/preview" ? (
        // <div className="flex items-center justify-center w-full">
        <button
          className="bg-white text-black px-6 py-2 shadow hover:bg-gray-200"
          onClick={handleOpenModal}
        >
          Reupload
        </button>
      ) : // </div>
      null}

      {/* File Upload Modal */}
      <FileUploadComponenet
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default NavBar;
