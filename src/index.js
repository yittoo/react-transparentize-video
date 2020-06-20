import React from "react";

class ReactTransparentizeVideos extends React.Component {
  constructor(props) {
    super(props);
    this.videoWrapper = React.createRef();
    this.videoMain = React.createRef();
    this.videoAlpha = React.createRef();
    this.canvasBuffer = React.createRef();
    this.canvasOutput = React.createRef();
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { frameUpdateInterval } = this.props;

    let outputCanvas = this.canvasOutput.current,
      output = outputCanvas.getContext("2d"),
      bufferCanvas = this.canvasBuffer.current,
      buffer = bufferCanvas.getContext("2d"),
      videoMain = this.videoMain.current,
      videoAlpha = this.videoAlpha.current,
      wrapper = this.videoWrapper.current,
      width = wrapper.clientWidth,
      height = wrapper.clientHeight,
      interval;

    bufferCanvas.width = wrapper.clientWidth;
    bufferCanvas.height = wrapper.clientHeight * 2;
    outputCanvas.width = wrapper.clientWidth;
    outputCanvas.height = wrapper.clientHeight;
    this.processFrame({
      videoMain,
      videoAlpha,
      width,
      height,
      buffer,
      output,
    });
    videoMain.addEventListener(
      "play",
      () => {
        clearInterval(interval);
        interval = setInterval(
          () =>
            this.processFrame({
              videoMain,
              videoAlpha,
              width,
              height,
              buffer,
              output,
            }),
          frameUpdateInterval
        );
      },
      false
    );
  };

  processFrame = ({ videoMain, videoAlpha, width, height, buffer, output }) => {
    const { videoOpacity } = this.props;

    buffer.drawImage(videoMain, 0, 0);
    buffer.drawImage(videoAlpha, 0, height);

    // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
    var image = buffer.getImageData(0, 0, width, height),
      imageData = image.data,
      alphaData = buffer.getImageData(0, height, width, height).data;

    for (var i = 3, len = imageData.length; i < len; i = i + 4) {
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
};

export default ReactTransparentizeVideos;
