import React from 'react';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

var PROCESS_TYPES = {
  seperateAlphaVideo: "seperateAlphaVideo",
  alphaVideoIncluded: "alphaVideoIncluded",
  transparentizeTargetColor: "transparentizeTargetColor",
  transparentizeColorRange: "transparentizeColorRange"
};

var ReactTransparentizeVideos = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactTransparentizeVideos, _React$Component);

  var _super = _createSuper(ReactTransparentizeVideos);

  function ReactTransparentizeVideos(props) {
    var _this;

    _classCallCheck(this, ReactTransparentizeVideos);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "callInit", function () {
      var type = _this.props.type;
      var videoMain = _this.videoMain.current;
      var videoAlpha = _this.videoAlpha.current;

      if (videoMain && type !== PROCESS_TYPES.seperateAlphaVideo) {
        videoMain.addEventListener("play", function () {
          _this.init();
        }, false);
      } else {
        var firstVideoPlayed = false;
        videoMain.addEventListener("play", function () {
          if (firstVideoPlayed) _this.init();
          firstVideoPlayed = true;
        }, false);
        videoAlpha.addEventListener("play", function () {
          if (firstVideoPlayed) _this.init();
          firstVideoPlayed = true;
        }, false);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "init", function () {
      var _this$props = _this.props,
          frameUpdateInterval = _this$props.frameUpdateInterval,
          type = _this$props.type;
      var outputCanvas = _this.canvasOutput.current,
          output = outputCanvas.getContext("2d"),
          bufferCanvas = _this.canvasBuffer.current,
          buffer = bufferCanvas.getContext("2d"),
          videoMain = _this.videoMain.current,
          videoAlpha = _this.videoAlpha.current,
          // wrapper = this.videoWrapper.current,
      width = videoMain.videoWidth,
          height = videoMain.videoHeight;

      _this.setOutputAndBufferSize({
        type: type,
        width: width,
        height: height,
        outputCanvas: outputCanvas,
        bufferCanvas: bufferCanvas
      });

      var fnToInterval;

      switch (type) {
        case PROCESS_TYPES.alphaVideoIncluded:
          fnToInterval = function fnToInterval() {
            _this.processFrameByComparingAlphaIncludedVideo({
              videoMain: videoMain,
              width: width,
              height: height / 2,
              buffer: buffer,
              output: output
            });
          };

          break;

        case PROCESS_TYPES.seperateAlphaVideo:
          fnToInterval = function fnToInterval() {
            _this.processFrameByComparingTwoVideos({
              videoMain: videoMain,
              videoAlpha: videoAlpha,
              width: width,
              height: height,
              buffer: buffer,
              output: output
            });
          };

          break;

        case PROCESS_TYPES.transparentizeColorRange:
          fnToInterval = function fnToInterval() {
            _this.processFrameByColorRange({
              videoMain: videoMain,
              width: width,
              height: height,
              buffer: buffer,
              output: output
            });
          };

          break;

        default:
          fnToInterval = function fnToInterval() {
            _this.processFrameBySingleVideoAndHexColor({
              videoMain: videoMain,
              width: width,
              height: height,
              buffer: buffer,
              output: output
            });
          };

          break;
      }

      clearInterval(_this.interval);
      _this.interval = setInterval(fnToInterval, frameUpdateInterval); // fnToInterval();
      // initialize scaling to wrapper after everything is set

      _this.scaleOutputToMatchParent();
    });

    _defineProperty(_assertThisInitialized(_this), "setOutputAndBufferSize", function (_ref) {
      var type = _ref.type,
          width = _ref.width,
          height = _ref.height,
          outputCanvas = _ref.outputCanvas,
          bufferCanvas = _ref.bufferCanvas;

      if (type === PROCESS_TYPES.seperateAlphaVideo || type === PROCESS_TYPES.transparentizeTargetColor || type === PROCESS_TYPES.transparentizeColorRange) {
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
    });

    _defineProperty(_assertThisInitialized(_this), "hexToRGB", function (hex) {
      if (!hex || hex.length !== 6 && hex.length !== 7) throw Error("Please specify a valid six digit hex color code under `colorToTransparentize` prop.");
      var hexStripped = hex.startsWith("#") ? hex.slice(1, 7) : hex;
      var parsedHex = parseInt(hexStripped, 16);
      var r = parsedHex >> 16 & 255;
      var g = parsedHex >> 8 & 255;
      var b = parsedHex & 255;
      return {
        r: r,
        g: g,
        b: b
      };
    });

    _defineProperty(_assertThisInitialized(_this), "scaleOutputToMatchParent", function () {
      var outputCanvas = _this.canvasOutput.current,
          wrapper = _this.videoWrapper.current;
      var scaleRatio = wrapper.clientWidth / outputCanvas.clientWidth;
      var scale = "scale(".concat(scaleRatio, ", ").concat(scaleRatio, ")"); // const scale = `scale(${wrapper.clientWidth / outputCanvas.clientWidth}, ${
      //   wrapper.clientHeight / outputCanvas.clientHeight
      // })`;

      outputCanvas.style.transform = scale;
    });

    _defineProperty(_assertThisInitialized(_this), "processFrameByComparingAlphaIncludedVideo", function (_ref2) {
      var videoMain = _ref2.videoMain,
          width = _ref2.width,
          height = _ref2.height,
          buffer = _ref2.buffer,
          output = _ref2.output;
      var videoOpacity = _this.props.videoOpacity;
      buffer.drawImage(videoMain, 0, 0);
      var image = buffer.getImageData(0, 0, width, height),
          imageData = image.data,
          alphaData = buffer.getImageData(0, height, width, height).data;

      for (var i = 3, len = imageData.length; i < len; i = i + 4) {
        imageData[i] = alphaData[i - 1] * videoOpacity;
      }

      output.putImageData(image, 0, 0, 0, 0, width, height);
    });

    _defineProperty(_assertThisInitialized(_this), "processFrameByColorRange", function (_ref3) {
      var videoMain = _ref3.videoMain,
          width = _ref3.width,
          height = _ref3.height,
          buffer = _ref3.buffer,
          output = _ref3.output;
      var _this$props2 = _this.props,
          videoOpacity = _this$props2.videoOpacity,
          colorRangeToTransparentize = _this$props2.colorRangeToTransparentize;
      if (!colorRangeToTransparentize) throw Error("Provide a `colorRangeToTransparentize` prop with following structure:\ncolorRangeToTransparentize = {\n  minR: Integer,\n  maxR: Integer,\n  minG: Integer,\n  maxG: Integer,\n  minB: Integer,\n  maxB: Integer,\n}");
      var minR = colorRangeToTransparentize.minR,
          maxR = colorRangeToTransparentize.maxR,
          minG = colorRangeToTransparentize.minG,
          maxG = colorRangeToTransparentize.maxG,
          minB = colorRangeToTransparentize.minB,
          maxB = colorRangeToTransparentize.maxB;
      buffer.drawImage(videoMain, 0, 0);
      var image = buffer.getImageData(0, 0, width, height),
          imageData = image.data;
      var isToTransparentize = false,
          rgb; // loop over each pixel in video

      for (var i = 0, len = imageData.length; i < len; i += 4) {
        // check whether the pixel matches the rgb value each item in array holds data in
        // [..., r, g, b, a,...] format where each entry is an index
        rgb = imageData.slice(i, i + 3);
        isToTransparentize = minR <= rgb[0] && rgb[0] <= maxR && minG <= rgb[1] && rgb[1] <= maxG && minB <= rgb[2] && rgb[2] <= maxB; // if (isToTransparentize) {
        //   console.log(minR, r, maxR, minG, g, maxG, minB, b, maxB);
        // }

        imageData[i + 3] = isToTransparentize ? 0 : imageData[i + 3] * videoOpacity;
      }

      output.putImageData(image, 0, 0, 0, 0, width, height);
    });

    _defineProperty(_assertThisInitialized(_this), "processFrameBySingleVideoAndHexColor", function (_ref4) {
      var videoMain = _ref4.videoMain,
          width = _ref4.width,
          height = _ref4.height,
          buffer = _ref4.buffer,
          output = _ref4.output;
      var rgbToDelete = _this.state.rgbToDelete;
      var r = rgbToDelete.r,
          g = rgbToDelete.g,
          b = rgbToDelete.b;
      var videoOpacity = _this.props.videoOpacity;
      buffer.drawImage(videoMain, 0, 0);
      var image = buffer.getImageData(0, 0, width, height),
          imageData = image.data;
      var isToTransparentize = false; // loop over each pixel in video

      for (var i = 0, len = imageData.length; i < len; i += 4) {
        // check whether the pixel matches the rgb value each item in array holds data in
        // [..., r, g, b, a,...] format where each entry is an index
        isToTransparentize = imageData[i] === r && imageData[i + 1] === g && imageData[i + 2] === b;
        imageData[i + 3] = isToTransparentize ? 0 : imageData[i + 3] * videoOpacity;
      }

      output.putImageData(image, 0, 0, 0, 0, width, height);
    });

    _defineProperty(_assertThisInitialized(_this), "processFrameByComparingTwoVideos", function (_ref5) {
      var videoMain = _ref5.videoMain,
          videoAlpha = _ref5.videoAlpha,
          width = _ref5.width,
          height = _ref5.height,
          buffer = _ref5.buffer,
          output = _ref5.output;
      var videoOpacity = _this.props.videoOpacity;
      buffer.drawImage(videoMain, 0, 0);
      buffer.drawImage(videoAlpha, 0, height);
      var image = buffer.getImageData(0, 0, width, height),
          imageData = image.data,
          alphaData = buffer.getImageData(0, height, width, height).data;

      for (var i = 3, len = imageData.length; i < len; i = i + 4) {
        imageData[i] = alphaData[i - 1] * videoOpacity;
      }

      output.putImageData(image, 0, 0, 0, 0, width, height);
    });

    _this.videoWrapper = /*#__PURE__*/React.createRef();
    _this.videoMain = /*#__PURE__*/React.createRef();
    _this.videoAlpha = /*#__PURE__*/React.createRef();
    _this.canvasBuffer = /*#__PURE__*/React.createRef();
    _this.canvasOutput = /*#__PURE__*/React.createRef();
    _this.state = {
      rgbToDelete: props.type === PROCESS_TYPES.transparentizeTargetColor ? _this.hexToRGB(props.colorToTransparentize) : null
    };
    _this.interval = null;
    _this.widthChangeListener = null;
    return _this;
  }

  _createClass(ReactTransparentizeVideos, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.callInit(); // Regularly componentMounting only occurs on client side however for safety
      // adding this check here to avoid crash on server-side rendering on a faulty
      // server side rendering logic

      if (typeof window !== "undefined") {
        window.addEventListener("resize", this.scaleOutputToMatchParent);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.scaleOutputToMatchParent);
      }
    } // add the waiting logic for video(s) to render and be able to start playing
    // before starting to execute the logic

  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          canvasFallback = _this$props3.canvasFallback,
          videoOpacity = _this$props3.videoOpacity,
          videoMain = _this$props3.videoMain,
          videoAlpha = _this$props3.videoAlpha,
          wrapperClassName = _this$props3.wrapperClassName,
          className = _this$props3.className,
          frameUpdateInterval = _this$props3.frameUpdateInterval,
          colorToTransparentize = _this$props3.colorToTransparentize,
          colorRangeToTransparentize = _this$props3.colorRangeToTransparentize,
          props = _objectWithoutProperties(_this$props3, ["canvasFallback", "videoOpacity", "videoMain", "videoAlpha", "wrapperClassName", "className", "frameUpdateInterval", "colorToTransparentize", "colorRangeToTransparentize"]);

      var outerWrapperClassname = [wrapperClassName, "transparentize-video-outer-wrapper"].join(" ");
      var outputCanvasClassname = [className, "transparentize-video-output-canvas"].join(" ");
      return /*#__PURE__*/React.createElement("div", _extends({}, props, {
        className: outerWrapperClassname
      }), /*#__PURE__*/React.createElement("div", {
        ref: this.videoWrapper,
        className: "transparentize-video-inner-wrapper"
      }, /*#__PURE__*/React.createElement("video", {
        ref: this.videoMain,
        autoPlay: true,
        loop: true,
        src: videoMain,
        className: "transparentize-video-main-video"
      }), /*#__PURE__*/React.createElement("video", {
        ref: this.videoAlpha,
        autoPlay: true,
        loop: true,
        src: videoAlpha,
        className: "transparentize-video-alpha-video"
      }), /*#__PURE__*/React.createElement("canvas", {
        ref: this.canvasBuffer,
        className: "transparentize-video-buffer-canvas"
      }), /*#__PURE__*/React.createElement("canvas", {
        ref: this.canvasOutput,
        className: outputCanvasClassname
      }, canvasFallback)));
    }
  }]);

  return ReactTransparentizeVideos;
}(React.Component);

ReactTransparentizeVideos.defaultProps = {
  videoOpacity: 1,
  frameUpdateInterval: 40,
  type: PROCESS_TYPES.transparentizeTargetColor,
  colorToTransparentize: "#000000"
};

export default ReactTransparentizeVideos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jb25zdCBQUk9DRVNTX1RZUEVTID0ge1xyXG4gIHNlcGVyYXRlQWxwaGFWaWRlbzogXCJzZXBlcmF0ZUFscGhhVmlkZW9cIixcclxuICBhbHBoYVZpZGVvSW5jbHVkZWQ6IFwiYWxwaGFWaWRlb0luY2x1ZGVkXCIsXHJcbiAgdHJhbnNwYXJlbnRpemVUYXJnZXRDb2xvcjogXCJ0cmFuc3BhcmVudGl6ZVRhcmdldENvbG9yXCIsXHJcbiAgdHJhbnNwYXJlbnRpemVDb2xvclJhbmdlOiBcInRyYW5zcGFyZW50aXplQ29sb3JSYW5nZVwiLFxyXG59O1xyXG5cclxuY2xhc3MgUmVhY3RUcmFuc3BhcmVudGl6ZVZpZGVvcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMudmlkZW9XcmFwcGVyID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLnZpZGVvTWFpbiA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG4gICAgdGhpcy52aWRlb0FscGhhID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLmNhbnZhc0J1ZmZlciA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG4gICAgdGhpcy5jYW52YXNPdXRwdXQgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICByZ2JUb0RlbGV0ZTpcclxuICAgICAgICBwcm9wcy50eXBlID09PSBQUk9DRVNTX1RZUEVTLnRyYW5zcGFyZW50aXplVGFyZ2V0Q29sb3JcclxuICAgICAgICAgID8gdGhpcy5oZXhUb1JHQihwcm9wcy5jb2xvclRvVHJhbnNwYXJlbnRpemUpXHJcbiAgICAgICAgICA6IG51bGwsXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xyXG4gICAgdGhpcy53aWR0aENoYW5nZUxpc3RlbmVyID0gbnVsbDtcclxuICB9XHJcblxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5jYWxsSW5pdCgpO1xyXG5cclxuICAgIC8vIFJlZ3VsYXJseSBjb21wb25lbnRNb3VudGluZyBvbmx5IG9jY3VycyBvbiBjbGllbnQgc2lkZSBob3dldmVyIGZvciBzYWZldHlcclxuICAgIC8vIGFkZGluZyB0aGlzIGNoZWNrIGhlcmUgdG8gYXZvaWQgY3Jhc2ggb24gc2VydmVyLXNpZGUgcmVuZGVyaW5nIG9uIGEgZmF1bHR5XHJcbiAgICAvLyBzZXJ2ZXIgc2lkZSByZW5kZXJpbmcgbG9naWNcclxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuc2NhbGVPdXRwdXRUb01hdGNoUGFyZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5zY2FsZU91dHB1dFRvTWF0Y2hQYXJlbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gYWRkIHRoZSB3YWl0aW5nIGxvZ2ljIGZvciB2aWRlbyhzKSB0byByZW5kZXIgYW5kIGJlIGFibGUgdG8gc3RhcnQgcGxheWluZ1xyXG4gIC8vIGJlZm9yZSBzdGFydGluZyB0byBleGVjdXRlIHRoZSBsb2dpY1xyXG4gIGNhbGxJbml0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgeyB0eXBlIH0gPSB0aGlzLnByb3BzO1xyXG4gICAgY29uc3QgdmlkZW9NYWluID0gdGhpcy52aWRlb01haW4uY3VycmVudDtcclxuICAgIGNvbnN0IHZpZGVvQWxwaGEgPSB0aGlzLnZpZGVvQWxwaGEuY3VycmVudDtcclxuXHJcbiAgICBpZiAodmlkZW9NYWluICYmIHR5cGUgIT09IFBST0NFU1NfVFlQRVMuc2VwZXJhdGVBbHBoYVZpZGVvKSB7XHJcbiAgICAgIHZpZGVvTWFpbi5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwicGxheVwiLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBmaXJzdFZpZGVvUGxheWVkID0gZmFsc2U7XHJcbiAgICAgIHZpZGVvTWFpbi5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwicGxheVwiLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIGlmIChmaXJzdFZpZGVvUGxheWVkKSB0aGlzLmluaXQoKTtcclxuICAgICAgICAgIGZpcnN0VmlkZW9QbGF5ZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgICAgdmlkZW9BbHBoYS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwicGxheVwiLFxyXG4gICAgICAgICgpID0+IHtcclxuICAgICAgICAgIGlmIChmaXJzdFZpZGVvUGxheWVkKSB0aGlzLmluaXQoKTtcclxuICAgICAgICAgIGZpcnN0VmlkZW9QbGF5ZWQgPSB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBpbml0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgeyBmcmFtZVVwZGF0ZUludGVydmFsLCB0eXBlIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIGxldCBvdXRwdXRDYW52YXMgPSB0aGlzLmNhbnZhc091dHB1dC5jdXJyZW50LFxyXG4gICAgICBvdXRwdXQgPSBvdXRwdXRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxyXG4gICAgICBidWZmZXJDYW52YXMgPSB0aGlzLmNhbnZhc0J1ZmZlci5jdXJyZW50LFxyXG4gICAgICBidWZmZXIgPSBidWZmZXJDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLFxyXG4gICAgICB2aWRlb01haW4gPSB0aGlzLnZpZGVvTWFpbi5jdXJyZW50LFxyXG4gICAgICB2aWRlb0FscGhhID0gdGhpcy52aWRlb0FscGhhLmN1cnJlbnQsXHJcbiAgICAgIC8vIHdyYXBwZXIgPSB0aGlzLnZpZGVvV3JhcHBlci5jdXJyZW50LFxyXG4gICAgICB3aWR0aCA9IHZpZGVvTWFpbi52aWRlb1dpZHRoLFxyXG4gICAgICBoZWlnaHQgPSB2aWRlb01haW4udmlkZW9IZWlnaHQ7XHJcblxyXG4gICAgdGhpcy5zZXRPdXRwdXRBbmRCdWZmZXJTaXplKHtcclxuICAgICAgdHlwZSxcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgb3V0cHV0Q2FudmFzLFxyXG4gICAgICBidWZmZXJDYW52YXMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgZm5Ub0ludGVydmFsO1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgUFJPQ0VTU19UWVBFUy5hbHBoYVZpZGVvSW5jbHVkZWQ6XHJcbiAgICAgICAgZm5Ub0ludGVydmFsID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnJhbWVCeUNvbXBhcmluZ0FscGhhSW5jbHVkZWRWaWRlbyh7XHJcbiAgICAgICAgICAgIHZpZGVvTWFpbixcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0IC8gMixcclxuICAgICAgICAgICAgYnVmZmVyLFxyXG4gICAgICAgICAgICBvdXRwdXQsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFBST0NFU1NfVFlQRVMuc2VwZXJhdGVBbHBoYVZpZGVvOlxyXG4gICAgICAgIGZuVG9JbnRlcnZhbCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc0ZyYW1lQnlDb21wYXJpbmdUd29WaWRlb3Moe1xyXG4gICAgICAgICAgICB2aWRlb01haW4sXHJcbiAgICAgICAgICAgIHZpZGVvQWxwaGEsXHJcbiAgICAgICAgICAgIHdpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgIGJ1ZmZlcixcclxuICAgICAgICAgICAgb3V0cHV0LFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBQUk9DRVNTX1RZUEVTLnRyYW5zcGFyZW50aXplQ29sb3JSYW5nZTpcclxuICAgICAgICBmblRvSW50ZXJ2YWwgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGcmFtZUJ5Q29sb3JSYW5nZSh7XHJcbiAgICAgICAgICAgIHZpZGVvTWFpbixcclxuICAgICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgICAgYnVmZmVyLFxyXG4gICAgICAgICAgICBvdXRwdXQsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGZuVG9JbnRlcnZhbCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc0ZyYW1lQnlTaW5nbGVWaWRlb0FuZEhleENvbG9yKHtcclxuICAgICAgICAgICAgdmlkZW9NYWluLFxyXG4gICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgICBidWZmZXIsXHJcbiAgICAgICAgICAgIG91dHB1dCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmblRvSW50ZXJ2YWwsIGZyYW1lVXBkYXRlSW50ZXJ2YWwpO1xyXG4gICAgLy8gZm5Ub0ludGVydmFsKCk7XHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZSBzY2FsaW5nIHRvIHdyYXBwZXIgYWZ0ZXIgZXZlcnl0aGluZyBpcyBzZXRcclxuICAgIHRoaXMuc2NhbGVPdXRwdXRUb01hdGNoUGFyZW50KCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gc2V0cyB0aGUgY2FudmFzIHNpemVzIGFjY29yZGluZyB0byBgdHlwZWAgYW5kIGB2aWRlb01haW5gIGRpbWVudGlvbnNcclxuICBzZXRPdXRwdXRBbmRCdWZmZXJTaXplID0gKHtcclxuICAgIHR5cGUsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIG91dHB1dENhbnZhcyxcclxuICAgIGJ1ZmZlckNhbnZhcyxcclxuICB9KSA9PiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHR5cGUgPT09IFBST0NFU1NfVFlQRVMuc2VwZXJhdGVBbHBoYVZpZGVvIHx8XHJcbiAgICAgIHR5cGUgPT09IFBST0NFU1NfVFlQRVMudHJhbnNwYXJlbnRpemVUYXJnZXRDb2xvciB8fFxyXG4gICAgICB0eXBlID09PSBQUk9DRVNTX1RZUEVTLnRyYW5zcGFyZW50aXplQ29sb3JSYW5nZVxyXG4gICAgKSB7XHJcbiAgICAgIGJ1ZmZlckNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICBidWZmZXJDYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogMjtcclxuICAgICAgb3V0cHV0Q2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgIG91dHB1dENhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFBST0NFU1NfVFlQRVMuYWxwaGFWaWRlb0luY2x1ZGVkKSB7XHJcbiAgICAgIGJ1ZmZlckNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICBidWZmZXJDYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICBvdXRwdXRDYW52YXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgb3V0cHV0Q2FudmFzLmhlaWdodCA9IGhlaWdodCAvIDI7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgaGV4VG9SR0IgPSAoaGV4KSA9PiB7XHJcbiAgICBpZiAoIWhleCB8fCAoaGV4Lmxlbmd0aCAhPT0gNiAmJiBoZXgubGVuZ3RoICE9PSA3KSlcclxuICAgICAgdGhyb3cgRXJyb3IoXHJcbiAgICAgICAgXCJQbGVhc2Ugc3BlY2lmeSBhIHZhbGlkIHNpeCBkaWdpdCBoZXggY29sb3IgY29kZSB1bmRlciBgY29sb3JUb1RyYW5zcGFyZW50aXplYCBwcm9wLlwiXHJcbiAgICAgICk7XHJcblxyXG4gICAgY29uc3QgaGV4U3RyaXBwZWQgPSBoZXguc3RhcnRzV2l0aChcIiNcIikgPyBoZXguc2xpY2UoMSwgNykgOiBoZXg7XHJcbiAgICBjb25zdCBwYXJzZWRIZXggPSBwYXJzZUludChoZXhTdHJpcHBlZCwgMTYpO1xyXG4gICAgY29uc3QgciA9IChwYXJzZWRIZXggPj4gMTYpICYgMjU1O1xyXG4gICAgY29uc3QgZyA9IChwYXJzZWRIZXggPj4gOCkgJiAyNTU7XHJcbiAgICBjb25zdCBiID0gcGFyc2VkSGV4ICYgMjU1O1xyXG5cclxuICAgIHJldHVybiB7IHIsIGcsIGIgfTtcclxuICB9O1xyXG5cclxuICAvLyBtaWdodCBiZSB3aXNlciB0byBub3Qgc2NhbGUgaGVpZ2h0IGFjY29yZGluZyB0byBwYXJlbnQgaGVpZ2h0IGluc3RlYWQgYWNjb3JkaW5nXHJcbiAgLy8gdG8gdGhlIHBhcmVudCB3aWR0aCBzY2FsZSBjYWxjdWxhdGlvbiB0byBhdm9pZCBzdHJldGNoaW5nIGR1ZSB0byB2aWRlbyByYXRpbyBjaGFuZ2VcclxuICBzY2FsZU91dHB1dFRvTWF0Y2hQYXJlbnQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBvdXRwdXRDYW52YXMgPSB0aGlzLmNhbnZhc091dHB1dC5jdXJyZW50LFxyXG4gICAgICB3cmFwcGVyID0gdGhpcy52aWRlb1dyYXBwZXIuY3VycmVudDtcclxuXHJcbiAgICBjb25zdCBzY2FsZVJhdGlvID0gd3JhcHBlci5jbGllbnRXaWR0aCAvIG91dHB1dENhbnZhcy5jbGllbnRXaWR0aDtcclxuICAgIGNvbnN0IHNjYWxlID0gYHNjYWxlKCR7c2NhbGVSYXRpb30sICR7c2NhbGVSYXRpb30pYDtcclxuICAgIC8vIGNvbnN0IHNjYWxlID0gYHNjYWxlKCR7d3JhcHBlci5jbGllbnRXaWR0aCAvIG91dHB1dENhbnZhcy5jbGllbnRXaWR0aH0sICR7XHJcbiAgICAvLyAgIHdyYXBwZXIuY2xpZW50SGVpZ2h0IC8gb3V0cHV0Q2FudmFzLmNsaWVudEhlaWdodFxyXG4gICAgLy8gfSlgO1xyXG5cclxuICAgIG91dHB1dENhbnZhcy5zdHlsZS50cmFuc2Zvcm0gPSBzY2FsZTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgdGhlIGZyYW1lIGJ5IHNwbGl0dGluZyB0aGUgaW5wdXQgdmlkZW8gaW4gaGFsZiBvbiB2ZXJ0aWNhbCBtaWRkbGVcclxuICAgKiB0aGUgYmVsb3cgaGFsZiBwYXJ0IGlzIGV4cGVjdGVkIHRvIGJlIGdyYXlzY2FsZWQgIHdvdWxkIGJlIHVzZWQgYXMgYWxwaGFcclxuICAgKiBvZiB1cHBlciBoYWxmXHJcbiAgICovXHJcbiAgcHJvY2Vzc0ZyYW1lQnlDb21wYXJpbmdBbHBoYUluY2x1ZGVkVmlkZW8gPSAoe1xyXG4gICAgdmlkZW9NYWluLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBidWZmZXIsXHJcbiAgICBvdXRwdXQsXHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3QgeyB2aWRlb09wYWNpdHkgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvTWFpbiwgMCwgMCk7XHJcblxyXG4gICAgbGV0IGltYWdlID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gaW1hZ2UuZGF0YSxcclxuICAgICAgYWxwaGFEYXRhID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCBoZWlnaHQsIHdpZHRoLCBoZWlnaHQpLmRhdGE7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDMsIGxlbiA9IGltYWdlRGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgPSBpICsgNCkge1xyXG4gICAgICBpbWFnZURhdGFbaV0gPSBhbHBoYURhdGFbaSAtIDFdICogdmlkZW9PcGFjaXR5O1xyXG4gICAgfVxyXG4gICAgb3V0cHV0LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCwgMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZSBpbiBhIHNpbmdsZSB2aWRlbyBhbmQgYSBoZXggY29sb3IgcmFuZ2UsIHVzZSB0aGF0IHRvIGRlbGV0ZSB0aGF0IGNvbG9yJ3MgcGl4ZWxzXHJcbiAgICogZnJvbSB2aWRlbyBhbmQgbWFrZSBpdCB0cmFuc3BhcmVudCwgdGhpcyB3aWxsIG5vdCBhbGxvdyBzZW1pLW9wYXF1ZSBhbmRcclxuICAgKiBtYWtlIHRoZSB2aWRlbyBlaXRoZXIgZnVsbHkgdHJhbnNwYXJlbnQgb3Igb3BhcXVlLCBvcHRpb25hbGx5IHZpZGVvIG9wYWNpdHkgcHJvcFxyXG4gICAqIGNhbiBnaXZlIGVudGlyZSBvdXRwdXQgb3BhY2l0eVxyXG4gICAqXHJcbiAgICogUGVyZm9ybWFuY2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyDCtHBvb3LCtCB0byBzYXkgdmVyeSBsZWFzdC4gVGhlIGlkZWEgbmVlZHMgaW1wcm92aW5nXHJcbiAgICogYmVmb3JlIGFjdHVhbGx5IHVzaW5nIGl0XHJcbiAgICovXHJcbiAgcHJvY2Vzc0ZyYW1lQnlDb2xvclJhbmdlID0gKHsgdmlkZW9NYWluLCB3aWR0aCwgaGVpZ2h0LCBidWZmZXIsIG91dHB1dCB9KSA9PiB7XHJcbiAgICBjb25zdCB7IHZpZGVvT3BhY2l0eSwgY29sb3JSYW5nZVRvVHJhbnNwYXJlbnRpemUgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBpZiAoIWNvbG9yUmFuZ2VUb1RyYW5zcGFyZW50aXplKVxyXG4gICAgICB0aHJvdyBFcnJvcihgUHJvdmlkZSBhIFxcYGNvbG9yUmFuZ2VUb1RyYW5zcGFyZW50aXplXFxgIHByb3Agd2l0aCBmb2xsb3dpbmcgc3RydWN0dXJlOlxyXG5jb2xvclJhbmdlVG9UcmFuc3BhcmVudGl6ZSA9IHtcclxuICBtaW5SOiBJbnRlZ2VyLFxyXG4gIG1heFI6IEludGVnZXIsXHJcbiAgbWluRzogSW50ZWdlcixcclxuICBtYXhHOiBJbnRlZ2VyLFxyXG4gIG1pbkI6IEludGVnZXIsXHJcbiAgbWF4QjogSW50ZWdlcixcclxufWApO1xyXG4gICAgY29uc3QgeyBtaW5SLCBtYXhSLCBtaW5HLCBtYXhHLCBtaW5CLCBtYXhCIH0gPSBjb2xvclJhbmdlVG9UcmFuc3BhcmVudGl6ZTtcclxuXHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvTWFpbiwgMCwgMCk7XHJcblxyXG4gICAgbGV0IGltYWdlID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gaW1hZ2UuZGF0YTtcclxuXHJcbiAgICBsZXQgaXNUb1RyYW5zcGFyZW50aXplID0gZmFsc2UsXHJcbiAgICAgIHJnYjtcclxuICAgIC8vIGxvb3Agb3ZlciBlYWNoIHBpeGVsIGluIHZpZGVvXHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW1hZ2VEYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSArPSA0KSB7XHJcbiAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhlIHBpeGVsIG1hdGNoZXMgdGhlIHJnYiB2YWx1ZSBlYWNoIGl0ZW0gaW4gYXJyYXkgaG9sZHMgZGF0YSBpblxyXG4gICAgICAvLyBbLi4uLCByLCBnLCBiLCBhLC4uLl0gZm9ybWF0IHdoZXJlIGVhY2ggZW50cnkgaXMgYW4gaW5kZXhcclxuICAgICAgcmdiID0gaW1hZ2VEYXRhLnNsaWNlKGksIGkgKyAzKTtcclxuICAgICAgaXNUb1RyYW5zcGFyZW50aXplID1cclxuICAgICAgICBtaW5SIDw9IHJnYlswXSAmJlxyXG4gICAgICAgIHJnYlswXSA8PSBtYXhSICYmXHJcbiAgICAgICAgbWluRyA8PSByZ2JbMV0gJiZcclxuICAgICAgICByZ2JbMV0gPD0gbWF4RyAmJlxyXG4gICAgICAgIG1pbkIgPD0gcmdiWzJdICYmXHJcbiAgICAgICAgcmdiWzJdIDw9IG1heEI7XHJcbiAgICAgIC8vIGlmIChpc1RvVHJhbnNwYXJlbnRpemUpIHtcclxuICAgICAgLy8gICBjb25zb2xlLmxvZyhtaW5SLCByLCBtYXhSLCBtaW5HLCBnLCBtYXhHLCBtaW5CLCBiLCBtYXhCKTtcclxuICAgICAgLy8gfVxyXG4gICAgICBpbWFnZURhdGFbaSArIDNdID0gaXNUb1RyYW5zcGFyZW50aXplXHJcbiAgICAgICAgPyAwXHJcbiAgICAgICAgOiBpbWFnZURhdGFbaSArIDNdICogdmlkZW9PcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDAsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgaW4gYSBzaW5nbGUgdmlkZW8gYW5kIGEgaGV4IGNvbG9yIHZhbHVlLCB1c2UgdGhhdCB0byBkZWxldGUgdGhhdCBjb2xvcidzXHJcbiAgICogcGl4ZWxzIGZyb20gdmlkZW8gYW5kIG1ha2UgaXQgdHJhbnNwYXJlbnQsIHRoaXMgd2lsbCBub3QgYWxsb3cgc2VtaS1vcGFxdWUgYW5kXHJcbiAgICogbWFrZSB0aGUgdmlkZW8gZWl0aGVyIGZ1bGx5IHRyYW5zcGFyZW50IG9yIG9wYXF1ZSwgb3B0aW9uYWxseSB2aWRlbyBvcGFjaXR5IHByb3BcclxuICAgKiBjYW4gZ2l2ZSBlbnRpcmUgb3V0cHV0IG9wYWNpdHlcclxuICAgKi9cclxuICBwcm9jZXNzRnJhbWVCeVNpbmdsZVZpZGVvQW5kSGV4Q29sb3IgPSAoe1xyXG4gICAgdmlkZW9NYWluLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBidWZmZXIsXHJcbiAgICBvdXRwdXQsXHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3QgeyByZ2JUb0RlbGV0ZSB9ID0gdGhpcy5zdGF0ZTtcclxuICAgIGNvbnN0IHsgciwgZywgYiB9ID0gcmdiVG9EZWxldGU7XHJcbiAgICBjb25zdCB7IHZpZGVvT3BhY2l0eSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvTWFpbiwgMCwgMCk7XHJcblxyXG4gICAgbGV0IGltYWdlID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gaW1hZ2UuZGF0YTtcclxuXHJcbiAgICBsZXQgaXNUb1RyYW5zcGFyZW50aXplID0gZmFsc2U7XHJcbiAgICAvLyBsb29wIG92ZXIgZWFjaCBwaXhlbCBpbiB2aWRlb1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGltYWdlRGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gNCkge1xyXG4gICAgICAvLyBjaGVjayB3aGV0aGVyIHRoZSBwaXhlbCBtYXRjaGVzIHRoZSByZ2IgdmFsdWUgZWFjaCBpdGVtIGluIGFycmF5IGhvbGRzIGRhdGEgaW5cclxuICAgICAgLy8gWy4uLiwgciwgZywgYiwgYSwuLi5dIGZvcm1hdCB3aGVyZSBlYWNoIGVudHJ5IGlzIGFuIGluZGV4XHJcbiAgICAgIGlzVG9UcmFuc3BhcmVudGl6ZSA9XHJcbiAgICAgICAgaW1hZ2VEYXRhW2ldID09PSByICYmIGltYWdlRGF0YVtpICsgMV0gPT09IGcgJiYgaW1hZ2VEYXRhW2kgKyAyXSA9PT0gYjtcclxuICAgICAgaW1hZ2VEYXRhW2kgKyAzXSA9IGlzVG9UcmFuc3BhcmVudGl6ZVxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogaW1hZ2VEYXRhW2kgKyAzXSAqIHZpZGVvT3BhY2l0eTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXQucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwLCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBUYWtlIGluIG9uZSBtYWluIHZpZGVvIGFuZCBvbmUgYWxwaGEgdmlkZW8gb2Ygc2FtZSBwcm9wb3J0aW9uc1xyXG4gICAqIHNldCBtYWluIHZpZGVvJ3MgcGl4ZWwgYWxwaGEgYWNjb3JkaW5nIHRvIGFscGhhIHZpZGVvJ3MgYWxwaGFcclxuICAgKi9cclxuICBwcm9jZXNzRnJhbWVCeUNvbXBhcmluZ1R3b1ZpZGVvcyA9ICh7XHJcbiAgICB2aWRlb01haW4sXHJcbiAgICB2aWRlb0FscGhhLFxyXG4gICAgd2lkdGgsXHJcbiAgICBoZWlnaHQsXHJcbiAgICBidWZmZXIsXHJcbiAgICBvdXRwdXQsXHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3QgeyB2aWRlb09wYWNpdHkgfSA9IHRoaXMucHJvcHM7XHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvTWFpbiwgMCwgMCk7XHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvQWxwaGEsIDAsIGhlaWdodCk7XHJcblxyXG4gICAgbGV0IGltYWdlID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gaW1hZ2UuZGF0YSxcclxuICAgICAgYWxwaGFEYXRhID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCBoZWlnaHQsIHdpZHRoLCBoZWlnaHQpLmRhdGE7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDMsIGxlbiA9IGltYWdlRGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgPSBpICsgNCkge1xyXG4gICAgICBpbWFnZURhdGFbaV0gPSBhbHBoYURhdGFbaSAtIDFdICogdmlkZW9PcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDAsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgY2FudmFzRmFsbGJhY2ssXHJcbiAgICAgIHZpZGVvT3BhY2l0eSxcclxuICAgICAgdmlkZW9NYWluLFxyXG4gICAgICB2aWRlb0FscGhhLFxyXG4gICAgICB3cmFwcGVyQ2xhc3NOYW1lLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIGZyYW1lVXBkYXRlSW50ZXJ2YWwsXHJcbiAgICAgIGNvbG9yVG9UcmFuc3BhcmVudGl6ZSxcclxuICAgICAgY29sb3JSYW5nZVRvVHJhbnNwYXJlbnRpemUsXHJcbiAgICAgIC4uLnByb3BzXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBjb25zdCBvdXRlcldyYXBwZXJDbGFzc25hbWUgPSBbXHJcbiAgICAgIHdyYXBwZXJDbGFzc05hbWUsXHJcbiAgICAgIFwidHJhbnNwYXJlbnRpemUtdmlkZW8tb3V0ZXItd3JhcHBlclwiLFxyXG4gICAgXS5qb2luKFwiIFwiKTtcclxuICAgIGNvbnN0IG91dHB1dENhbnZhc0NsYXNzbmFtZSA9IFtcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBcInRyYW5zcGFyZW50aXplLXZpZGVvLW91dHB1dC1jYW52YXNcIixcclxuICAgIF0uam9pbihcIiBcIik7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHsuLi5wcm9wc30gY2xhc3NOYW1lPXtvdXRlcldyYXBwZXJDbGFzc25hbWV9PlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHJlZj17dGhpcy52aWRlb1dyYXBwZXJ9XHJcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0cmFuc3BhcmVudGl6ZS12aWRlby1pbm5lci13cmFwcGVyXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8dmlkZW9cclxuICAgICAgICAgICAgcmVmPXt0aGlzLnZpZGVvTWFpbn1cclxuICAgICAgICAgICAgYXV0b1BsYXlcclxuICAgICAgICAgICAgbG9vcFxyXG4gICAgICAgICAgICBzcmM9e3ZpZGVvTWFpbn1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tbWFpbi12aWRlb1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPHZpZGVvXHJcbiAgICAgICAgICAgIHJlZj17dGhpcy52aWRlb0FscGhhfVxyXG4gICAgICAgICAgICBhdXRvUGxheVxyXG4gICAgICAgICAgICBsb29wXHJcbiAgICAgICAgICAgIHNyYz17dmlkZW9BbHBoYX1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tYWxwaGEtdmlkZW9cIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxjYW52YXNcclxuICAgICAgICAgICAgcmVmPXt0aGlzLmNhbnZhc0J1ZmZlcn1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tYnVmZmVyLWNhbnZhc1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPGNhbnZhcyByZWY9e3RoaXMuY2FudmFzT3V0cHV0fSBjbGFzc05hbWU9e291dHB1dENhbnZhc0NsYXNzbmFtZX0+XHJcbiAgICAgICAgICAgIHtjYW52YXNGYWxsYmFja31cclxuICAgICAgICAgIDwvY2FudmFzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5SZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zLmRlZmF1bHRQcm9wcyA9IHtcclxuICB2aWRlb09wYWNpdHk6IDEsXHJcbiAgZnJhbWVVcGRhdGVJbnRlcnZhbDogNDAsXHJcbiAgdHlwZTogUFJPQ0VTU19UWVBFUy50cmFuc3BhcmVudGl6ZVRhcmdldENvbG9yLFxyXG4gIGNvbG9yVG9UcmFuc3BhcmVudGl6ZTogXCIjMDAwMDAwXCIsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zO1xyXG4iXSwibmFtZXMiOlsiUFJPQ0VTU19UWVBFUyIsInNlcGVyYXRlQWxwaGFWaWRlbyIsImFscGhhVmlkZW9JbmNsdWRlZCIsInRyYW5zcGFyZW50aXplVGFyZ2V0Q29sb3IiLCJ0cmFuc3BhcmVudGl6ZUNvbG9yUmFuZ2UiLCJSZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zIiwicHJvcHMiLCJ0eXBlIiwidmlkZW9NYWluIiwiY3VycmVudCIsInZpZGVvQWxwaGEiLCJhZGRFdmVudExpc3RlbmVyIiwiaW5pdCIsImZpcnN0VmlkZW9QbGF5ZWQiLCJmcmFtZVVwZGF0ZUludGVydmFsIiwib3V0cHV0Q2FudmFzIiwiY2FudmFzT3V0cHV0Iiwib3V0cHV0IiwiZ2V0Q29udGV4dCIsImJ1ZmZlckNhbnZhcyIsImNhbnZhc0J1ZmZlciIsImJ1ZmZlciIsIndpZHRoIiwidmlkZW9XaWR0aCIsImhlaWdodCIsInZpZGVvSGVpZ2h0Iiwic2V0T3V0cHV0QW5kQnVmZmVyU2l6ZSIsImZuVG9JbnRlcnZhbCIsInByb2Nlc3NGcmFtZUJ5Q29tcGFyaW5nQWxwaGFJbmNsdWRlZFZpZGVvIiwicHJvY2Vzc0ZyYW1lQnlDb21wYXJpbmdUd29WaWRlb3MiLCJwcm9jZXNzRnJhbWVCeUNvbG9yUmFuZ2UiLCJwcm9jZXNzRnJhbWVCeVNpbmdsZVZpZGVvQW5kSGV4Q29sb3IiLCJjbGVhckludGVydmFsIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInNjYWxlT3V0cHV0VG9NYXRjaFBhcmVudCIsImhleCIsImxlbmd0aCIsIkVycm9yIiwiaGV4U3RyaXBwZWQiLCJzdGFydHNXaXRoIiwic2xpY2UiLCJwYXJzZWRIZXgiLCJwYXJzZUludCIsInIiLCJnIiwiYiIsIndyYXBwZXIiLCJ2aWRlb1dyYXBwZXIiLCJzY2FsZVJhdGlvIiwiY2xpZW50V2lkdGgiLCJzY2FsZSIsInN0eWxlIiwidHJhbnNmb3JtIiwidmlkZW9PcGFjaXR5IiwiZHJhd0ltYWdlIiwiaW1hZ2UiLCJnZXRJbWFnZURhdGEiLCJpbWFnZURhdGEiLCJkYXRhIiwiYWxwaGFEYXRhIiwiaSIsImxlbiIsInB1dEltYWdlRGF0YSIsImNvbG9yUmFuZ2VUb1RyYW5zcGFyZW50aXplIiwibWluUiIsIm1heFIiLCJtaW5HIiwibWF4RyIsIm1pbkIiLCJtYXhCIiwiaXNUb1RyYW5zcGFyZW50aXplIiwicmdiIiwicmdiVG9EZWxldGUiLCJzdGF0ZSIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiaGV4VG9SR0IiLCJjb2xvclRvVHJhbnNwYXJlbnRpemUiLCJ3aWR0aENoYW5nZUxpc3RlbmVyIiwiY2FsbEluaXQiLCJ3aW5kb3ciLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2FudmFzRmFsbGJhY2siLCJ3cmFwcGVyQ2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwib3V0ZXJXcmFwcGVyQ2xhc3NuYW1lIiwiam9pbiIsIm91dHB1dENhbnZhc0NsYXNzbmFtZSIsIkNvbXBvbmVudCIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGFBQWEsR0FBRztBQUNwQkMsRUFBQUEsa0JBQWtCLEVBQUUsb0JBREE7QUFFcEJDLEVBQUFBLGtCQUFrQixFQUFFLG9CQUZBO0FBR3BCQyxFQUFBQSx5QkFBeUIsRUFBRSwyQkFIUDtBQUlwQkMsRUFBQUEsd0JBQXdCLEVBQUU7QUFKTixDQUF0Qjs7SUFPTUM7Ozs7O0FBQ0oscUNBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDakIsOEJBQU1BLEtBQU47O0FBRGlCLCtEQXNDUixZQUFNO0FBQUEsVUFDUEMsSUFETyxHQUNFLE1B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
