import React from "react";
import { Helmet } from "react-helmet";
import abhi from '../assets/abhi.jpg'
import prem from '../assets/prem.jpg'
import sujal from '../assets/sujal.jpg'

const teamMembers = [
    {
        name: "Abhishek Gujarathi",
        role: "Designer & Developer",
        batch: "VGEC Chandkheda (2026) ",
        linkedin: "#",
        github: "#",
        image: abhi
    },
    {
        name: "Prem Dave",
        role: "Designer & Developer",
        batch: "VGEC Chandkheda (2026) ",
        linkedin: "#",
        github: "#",
        image: prem
    },
    {
        name: "Sujal Myatara",
        role: "Designer & Developer",
        batch: "VGEC Chandkheda (2026) ",
        linkedin: "#",
        github: "#",
        image: sujal 
    }
];

const Team = () => {
    return (
        
        <div className="py-10 bg-white">
             <Helmet>
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
            </Helmet>
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Meet Our Team
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                    The driving force behind our success in tech, and a cornerstone of our innovation in design.
                </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 justify-center px-5">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 text-center h-[280px] w-[250px]"
                    >
                        <img
                            className="w-24 h-24 mx-auto rounded-full ring-2 ring-blue-400 mb-4"
                            src={member.image}
                            alt={member.name}
                        />
                        <h3 className="text-lg font-semibold text-gray-800">
                            {member.name}
                        </h3>
                        <p className="text-blue-500">{member.role}</p>
                        <p className="text-sm text-gray-600">{member.batch}</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <i className="fab fa-linkedin fa-lg"></i>
                            </a>
                            <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-black"
                            >
                                <i className="fab fa-github fa-lg"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Team;
