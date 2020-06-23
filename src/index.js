import React from "react";

const PROCESS_TYPES = {
  seperateAlphaVideo: "seperateAlphaVideo",
  alphaVideoIncluded: "alphaVideoIncluded",
  transparentizeTargetColor: "transparentizeTargetColor",
  transparentizeColorRange: "transparentizeColorRange",
};

class ReactTransparentizeVideos extends React.Component {
  constructor(props) {
    super(props);
    this.videoWrapper = React.createRef();
    this.videoMain = React.createRef();
    this.videoAlpha = React.createRef();
    this.canvasBuffer = React.createRef();
    this.canvasOutput = React.createRef();

    this.state = {
      rgbToDelete:
        props.type === PROCESS_TYPES.transparentizeTargetColor
          ? this.hexToRGB(props.colorToTransparentize)
          : null,
    };

    this.interval = null;
    this.widthChangeListener = null;
  }

  componentDidMount() {
    this.callInit();

    // Regularly componentMounting only occurs on client side however for safety
    // adding this check here to avoid crash on server-side rendering on a faulty
    // server side rendering logic
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.scaleOutputToMatchParent);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.scaleOutputToMatchParent);
    }
  }

  // add the waiting logic for video(s) to render and be able to start playing
  // before starting to execute the logic
  callInit = () => {
    const { type } = this.props;
    const videoMain = this.videoMain.current;
    const videoAlpha = this.videoAlpha.current;

    if (videoMain && type !== PROCESS_TYPES.seperateAlphaVideo) {
      videoMain.addEventListener(
        "play",
        () => {
          this.init();
        },
        false
      );
    } else {
      let firstVideoPlayed = false;
      videoMain.addEventListener(
        "play",
        () => {
          if (firstVideoPlayed) this.init();
          firstVideoPlayed = true;
        },
        false
      );
      videoAlpha.addEventListener(
        "play",
        () => {
          if (firstVideoPlayed) this.init();
          firstVideoPlayed = true;
        },
        false
      );
    }
  };

  init = () => {
    const { frameUpdateInterval, type } = this.props;

    let outputCanvas = this.canvasOutput.current,
      output = outputCanvas.getContext("2d"),
      bufferCanvas = this.canvasBuffer.current,
      buffer = bufferCanvas.getContext("2d"),
      videoMain = this.videoMain.current,
      videoAlpha = this.videoAlpha.current,
      // wrapper = this.videoWrapper.current,
      width = videoMain.videoWidth,
      height = videoMain.videoHeight;

    this.setOutputAndBufferSize({
      type,
      width,
      height,
      outputCanvas,
      bufferCanvas,
    });

    let fnToInterval;
    switch (type) {
      case PROCESS_TYPES.alphaVideoIncluded:
        fnToInterval = () => {
          this.processFrameByComparingAlphaIncludedVideo({
            videoMain,
            width,
            height: height / 2,
            buffer,
            output,
          });
        };
        break;
      case PROCESS_TYPES.seperateAlphaVideo:
        fnToInterval = () => {
          this.processFrameByComparingTwoVideos({
            videoMain,
            videoAlpha,
            width,
            height,
            buffer,
            output,
          });
        };
        break;
      case PROCESS_TYPES.transparentizeColorRange:
        fnToInterval = () => {
          this.processFrameByColorRange({
            videoMain,
            width,
            height,
            buffer,
            output,
          });
        };
        break;
      default:
        fnToInterval = () => {
          this.processFrameBySingleVideoAndHexColor({
            videoMain,
            width,
            height,
            buffer,
            output,
          });
        };
        break;
    }

    clearInterval(this.interval);
    this.interval = setInterval(fnToInterval, frameUpdateInterval);
    // fnToInterval();

    // initialize scaling to wrapper after everything is set
    this.scaleOutputToMatchParent();
  };

  // sets the canvas sizes according to `type` and `videoMain` dimentions
  setOutputAndBufferSize = ({
    type,
    width,
    height,
    outputCanvas,
    bufferCanvas,
  }) => {
    if (
      type === PROCESS_TYPES.seperateAlphaVideo ||
      type === PROCESS_TYPES.transparentizeTargetColor ||
      type === PROCESS_TYPES.transparentizeColorRange
    ) {
      bufferCanvas.width = width;
      bufferCanvas.height = height * 2;
      outputCanvas.width = width;
      outputCanvas.height = height;
    } else if (type === PROCESS_TYPES.alphaVideoIncluded) {
      bufferCanvas.width = width;
      bufferCanvas.height = height;
      outputCanvas.width = width;
      outputCanvas.height = height / 2;
    }
  };

  hexToRGB = (hex) => {
    if (!hex || (hex.length !== 6 && hex.length !== 7))
      throw Error(
        "Please specify a valid six digit hex color code under `colorToTransparentize` prop."
      );

    const hexStripped = hex.startsWith("#") ? hex.slice(1, 7) : hex;
    const parsedHex = parseInt(hexStripped, 16);
    const r = (parsedHex >> 16) & 255;
    const g = (parsedHex >> 8) & 255;
    const b = parsedHex & 255;

    return { r, g, b };
  };

  // might be wiser to not scale height according to parent height instead according
  // to the parent width scale calculation to avoid stretching due to video ratio change
  scaleOutputToMatchParent = () => {
    const outputCanvas = this.canvasOutput.current,
      wrapper = this.videoWrapper.current;

    const scaleRatio = wrapper.clientWidth / outputCanvas.clientWidth;
    const scale = `scale(${scaleRatio}, ${scaleRatio})`;
    // const scale = `scale(${wrapper.clientWidth / outputCanvas.clientWidth}, ${
    //   wrapper.clientHeight / outputCanvas.clientHeight
    // })`;

    outputCanvas.style.transform = scale;
  };

  /**
   * Processes the frame by splitting the input video in half on vertical middle
   * the below half part is expected to be grayscaled  would be used as alpha
   * of upper half
   */
  processFrameByComparingAlphaIncludedVideo = ({
    videoMain,
    width,
    height,
    buffer,
    output,
  }) => {
    const { videoOpacity } = this.props;
    buffer.drawImage(videoMain, 0, 0);

    let image = buffer.getImageData(0, 0, width, height),
      imageData = image.data,
      alphaData = buffer.getImageData(0, height, width, height).data;

    for (let i = 3, len = imageData.length; i < len; i = i + 4) {
      imageData[i] = alphaData[i - 1] * videoOpacity;
    }
    output.putImageData(image, 0, 0, 0, 0, width, height);
  };

  /**
   * Take in a single video and a hex color range, use that to delete that color's pixels
   * from video and make it transparent, this will not allow semi-opaque and
   * make the video either fully transparent or opaque, optionally video opacity prop
   * can give entire output opacity
   *
   * Performance of this function is ´poor´ to say very least. The idea needs improving
   * before actually using it
   */
  processFrameByColorRange = ({ videoMain, width, height, buffer, output }) => {
    const { videoOpacity, colorRangeToTransparentize } = this.props;
    if (!colorRangeToTransparentize)
      throw Error(`Provide a \`colorRangeToTransparentize\` prop with following structure:
colorRangeToTransparentize = {
  minR: Integer,
  maxR: Integer,
  minG: Integer,
  maxG: Integer,
  minB: Integer,
  maxB: Integer,
}`);
    const { minR, maxR, minG, maxG, minB, maxB } = colorRangeToTransparentize;

    buffer.drawImage(videoMain, 0, 0);

    let image = buffer.getImageData(0, 0, width, height),
      imageData = image.data;

    let isToTransparentize = false,
      rgb;
    // loop over each pixel in video
    for (let i = 0, len = imageData.length; i < len; i += 4) {
      // check whether the pixel matches the rgb value each item in array holds data in
      // [..., r, g, b, a,...] format where each entry is an index
      rgb = imageData.slice(i, i + 3);
      isToTransparentize =
        minR <= rgb[0] &&
        rgb[0] <= maxR &&
        minG <= rgb[1] &&
        rgb[1] <= maxG &&
        minB <= rgb[2] &&
        rgb[2] <= maxB;
      // if (isToTransparentize) {
      //   console.log(minR, r, maxR, minG, g, maxG, minB, b, maxB);
      // }
      imageData[i + 3] = isToTransparentize
        ? 0
        : imageData[i + 3] * videoOpacity;
    }

    output.putImageData(image, 0, 0, 0, 0, width, height);
  };

  /**
   * Take in a single video and a hex color value, use that to delete that color's
   * pixels from video and make it transparent, this will not allow semi-opaque and
   * make the video either fully transparent or opaque, optionally video opacity prop
   * can give entire output opacity
   */
  processFrameBySingleVideoAndHexColor = ({
    videoMain,
    width,
    height,
    buffer,
    output,
  }) => {
    const { rgbToDelete } = this.state;
    const { r, g, b } = rgbToDelete;
    const { videoOpacity } = this.props;

    buffer.drawImage(videoMain, 0, 0);

    let image = buffer.getImageData(0, 0, width, height),
      imageData = image.data;

    let isToTransparentize = false;
    // loop over each pixel in video
    for (let i = 0, len = imageData.length; i < len; i += 4) {
      // check whether the pixel matches the rgb value each item in array holds data in
      // [..., r, g, b, a,...] format where each entry is an index
      isToTransparentize =
        imageData[i] === r && imageData[i + 1] === g && imageData[i + 2] === b;
      imageData[i + 3] = isToTransparentize
        ? 0
        : imageData[i + 3] * videoOpacity;
    }

    output.putImageData(image, 0, 0, 0, 0, width, height);
  };

  /**
   * Take in one main video and one alpha video of same proportions
   * set main video's pixel alpha according to alpha video's alpha
   */
  processFrameByComparingTwoVideos = ({
    videoMain,
    videoAlpha,
    width,
    height,
    buffer,
    output,
  }) => {
    const { videoOpacity } = this.props;
    buffer.drawImage(videoMain, 0, 0);
    buffer.drawImage(videoAlpha, 0, height);

    let image = buffer.getImageData(0, 0, width, height),
      imageData = image.data,
      alphaData = buffer.getImageData(0, height, width, height).data;

    for (let i = 3, len = imageData.length; i < len; i = i + 4) {
      imageData[i] = alphaData[i - 1] * videoOpacity;
    }

    output.putImageData(image, 0, 0, 0, 0, width, height);
  };

  render() {
    const {
      canvasFallback,
      videoOpacity,
      videoMain,
      videoAlpha,
      wrapperClassName,
      className,
      frameUpdateInterval,
      colorToTransparentize,
      colorRangeToTransparentize,
      ...props
    } = this.props;

    const outerWrapperClassname = [
      wrapperClassName,
      "transparentize-video-outer-wrapper",
    ].join(" ");
    const outputCanvasClassname = [
      className,
      "transparentize-video-output-canvas",
    ].join(" ");
    return (
      <div {...props} className={outerWrapperClassname}>
        <div
          ref={this.videoWrapper}
          className="transparentize-video-inner-wrapper"
        >
          <video
            ref={this.videoMain}
            autoPlay
            loop
            src={videoMain}
            className="transparentize-video-main-video"
          />
          <video
            ref={this.videoAlpha}
            autoPlay
            loop
            src={videoAlpha}
            className="transparentize-video-alpha-video"
          />
          <canvas
            ref={this.canvasBuffer}
            className="transparentize-video-buffer-canvas"
          />
          <canvas ref={this.canvasOutput} className={outputCanvasClassname}>
            {canvasFallback}
          </canvas>
        </div>
      </div>
    );
  }
}

ReactTransparentizeVideos.defaultProps = {
  videoOpacity: 1,
  frameUpdateInterval: 40,
  type: PROCESS_TYPES.transparentizeTargetColor,
  colorToTransparentize: "#000000",
};

export default ReactTransparentizeVideos;
