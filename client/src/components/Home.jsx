import React from "react";
import LandPage from "./LandPage";
import NavBar from "./NavBar";
import Works from "./Works";
import Team from "./Team";

function Home() {
  return (
    <>
      <NavBar />
      <LandPage />
      <Works />
      <Team />
    </>
  );
}

export default Home;
