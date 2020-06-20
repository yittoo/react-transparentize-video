# react-transparentize-video
A small react package that transparentizes the given video with html5 canvas

<strong>This library still is experimental, browser supports are not at all tested.</strong>

Usage example ( can also be seen in demo/src/index.js - inside the project `npm run demo` to view it on port 3000 )

```
import React from "react";

import "react-transparentize-video/dist/style.css";
import ReactTransparentizeVideos from "react-transparentize-video";

import VideoMain from "../some_main_video.mp4";
import VideoAlpha from "../some_alpha_video.mp4";

const App = () => {
  return (
    <div className="example-wrapper-div">
      <ReactTransparentizeVideos
        videoMain={VideoMain}
        videoAlpha={VideoAlpha}
      />
    </div>
  );
};

export default App;

```

## How should the alpha video be?
- Basicly the alpha video's each pixel's alpha value will be taken and shifted over to main video's exact pixel's alpha value. So alpha video can basicly be grayscaled version of original video where fully transparent parts are black and opaque parts are white, also rgb(128, 128, 128) pixel on alpha video can act as 50% opaque.
