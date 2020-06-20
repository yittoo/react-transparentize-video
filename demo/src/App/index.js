import React from "react";

import "../../../dist/style.css";
// import ReactTransparentizeVideos from "../../../dist/bundle";
import ReactTransparentizeVideos from "../../../src/";

import DropletsMain from "../assets/droplets.mp4";
import DropletsAlpha from "../assets/droplets_alpha.mp4";

const App = () => {
  return (
    <div
      style={{
        height: 600,
        width: 200,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <ReactTransparentizeVideos
        videoMain={DropletsMain}
        videoAlpha={DropletsAlpha}
      />
    </div>
  );
};

export default App;
