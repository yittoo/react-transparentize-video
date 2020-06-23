import React from "react";

import "../../../dist/style.css";
import ReactTransparentizeVideos from "../../../src/";

import DropletsMain from "../assets/droplets.mp4";
import DropletsAlpha from "../assets/droplets_alpha.mp4";
import AlphaIncluded from "../assets/alpha_included.mp4";

// TODO, demo all types with a top switch
const App = () => {
  return (
    <div
      style={{
        // height: "90vh",
        width: "90vw",
        height: "90vh",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <ReactTransparentizeVideos
        videoMain={AlphaIncluded}
        // videoMain={DropletsMain}
        // videoAlpha={DropletsAlpha}
        type="transparentizeColorRange"
        colorRangeToTransparentize={{
          minR: 0,
          maxR: 25,
          minG: 0,
          maxG: 25,
          minB: 0,
          maxB: 25,
        }}
      />
    </div>
  );
};

export default App;
