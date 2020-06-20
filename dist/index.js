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

var ReactTransparentizeVideos = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactTransparentizeVideos, _React$Component);

  var _super = _createSuper(ReactTransparentizeVideos);

  function ReactTransparentizeVideos(props) {
    var _this;

    _classCallCheck(this, ReactTransparentizeVideos);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "init", function () {
      var frameUpdateInterval = _this.props.frameUpdateInterval;
      var outputCanvas = _this.canvasOutput.current,
          output = outputCanvas.getContext("2d"),
          bufferCanvas = _this.canvasBuffer.current,
          buffer = bufferCanvas.getContext("2d"),
          videoMain = _this.videoMain.current,
          videoAlpha = _this.videoAlpha.current,
          wrapper = _this.videoWrapper.current,
          width = wrapper.clientWidth,
          height = wrapper.clientHeight,
          interval;
      bufferCanvas.width = wrapper.clientWidth;
      bufferCanvas.height = wrapper.clientHeight * 2;
      outputCanvas.width = wrapper.clientWidth;
      outputCanvas.height = wrapper.clientHeight;

      _this.processFrame({
        videoMain: videoMain,
        videoAlpha: videoAlpha,
        width: width,
        height: height,
        buffer: buffer,
        output: output
      });

      videoMain.addEventListener("play", function () {
        clearInterval(interval);
        interval = setInterval(function () {
          return _this.processFrame({
            videoMain: videoMain,
            videoAlpha: videoAlpha,
            width: width,
            height: height,
            buffer: buffer,
            output: output
          });
        }, frameUpdateInterval);
      }, false);
    });

    _defineProperty(_assertThisInitialized(_this), "processFrame", function (_ref) {
      var videoMain = _ref.videoMain,
          videoAlpha = _ref.videoAlpha,
          width = _ref.width,
          height = _ref.height,
          buffer = _ref.buffer,
          output = _ref.output;
      var videoOpacity = _this.props.videoOpacity;
      buffer.drawImage(videoMain, 0, 0);
      buffer.drawImage(videoAlpha, 0, height); // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas

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
    return _this;
  }

  _createClass(ReactTransparentizeVideos, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.init();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          canvasFallback = _this$props.canvasFallback,
          videoOpacity = _this$props.videoOpacity,
          videoMain = _this$props.videoMain,
          videoAlpha = _this$props.videoAlpha,
          wrapperClassName = _this$props.wrapperClassName,
          className = _this$props.className,
          frameUpdateInterval = _this$props.frameUpdateInterval,
          props = _objectWithoutProperties(_this$props, ["canvasFallback", "videoOpacity", "videoMain", "videoAlpha", "wrapperClassName", "className", "frameUpdateInterval"]);

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
  frameUpdateInterval: 40
};

export default ReactTransparentizeVideos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5jbGFzcyBSZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy52aWRlb1dyYXBwZXIgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuICAgIHRoaXMudmlkZW9NYWluID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLnZpZGVvQWxwaGEgPSBSZWFjdC5jcmVhdGVSZWYoKTtcclxuICAgIHRoaXMuY2FudmFzQnVmZmVyID0gUmVhY3QuY3JlYXRlUmVmKCk7XHJcbiAgICB0aGlzLmNhbnZhc091dHB1dCA9IFJlYWN0LmNyZWF0ZVJlZigpO1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIGluaXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB7IGZyYW1lVXBkYXRlSW50ZXJ2YWwgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgbGV0IG91dHB1dENhbnZhcyA9IHRoaXMuY2FudmFzT3V0cHV0LmN1cnJlbnQsXHJcbiAgICAgIG91dHB1dCA9IG91dHB1dENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksXHJcbiAgICAgIGJ1ZmZlckNhbnZhcyA9IHRoaXMuY2FudmFzQnVmZmVyLmN1cnJlbnQsXHJcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlckNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiksXHJcbiAgICAgIHZpZGVvTWFpbiA9IHRoaXMudmlkZW9NYWluLmN1cnJlbnQsXHJcbiAgICAgIHZpZGVvQWxwaGEgPSB0aGlzLnZpZGVvQWxwaGEuY3VycmVudCxcclxuICAgICAgd3JhcHBlciA9IHRoaXMudmlkZW9XcmFwcGVyLmN1cnJlbnQsXHJcbiAgICAgIHdpZHRoID0gd3JhcHBlci5jbGllbnRXaWR0aCxcclxuICAgICAgaGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQsXHJcbiAgICAgIGludGVydmFsO1xyXG5cclxuICAgIGJ1ZmZlckNhbnZhcy53aWR0aCA9IHdyYXBwZXIuY2xpZW50V2lkdGg7XHJcbiAgICBidWZmZXJDYW52YXMuaGVpZ2h0ID0gd3JhcHBlci5jbGllbnRIZWlnaHQgKiAyO1xyXG4gICAgb3V0cHV0Q2FudmFzLndpZHRoID0gd3JhcHBlci5jbGllbnRXaWR0aDtcclxuICAgIG91dHB1dENhbnZhcy5oZWlnaHQgPSB3cmFwcGVyLmNsaWVudEhlaWdodDtcclxuICAgIHRoaXMucHJvY2Vzc0ZyYW1lKHtcclxuICAgICAgdmlkZW9NYWluLFxyXG4gICAgICB2aWRlb0FscGhhLFxyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBidWZmZXIsXHJcbiAgICAgIG91dHB1dCxcclxuICAgIH0pO1xyXG4gICAgdmlkZW9NYWluLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIFwicGxheVwiLFxyXG4gICAgICAoKSA9PiB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XHJcbiAgICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChcclxuICAgICAgICAgICgpID0+XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0ZyYW1lKHtcclxuICAgICAgICAgICAgICB2aWRlb01haW4sXHJcbiAgICAgICAgICAgICAgdmlkZW9BbHBoYSxcclxuICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgYnVmZmVyLFxyXG4gICAgICAgICAgICAgIG91dHB1dCxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICBmcmFtZVVwZGF0ZUludGVydmFsXHJcbiAgICAgICAgKTtcclxuICAgICAgfSxcclxuICAgICAgZmFsc2VcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgcHJvY2Vzc0ZyYW1lID0gKHsgdmlkZW9NYWluLCB2aWRlb0FscGhhLCB3aWR0aCwgaGVpZ2h0LCBidWZmZXIsIG91dHB1dCB9KSA9PiB7XHJcbiAgICBjb25zdCB7IHZpZGVvT3BhY2l0eSB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvTWFpbiwgMCwgMCk7XHJcbiAgICBidWZmZXIuZHJhd0ltYWdlKHZpZGVvQWxwaGEsIDAsIGhlaWdodCk7XHJcblxyXG4gICAgLy8gdGhpcyBjYW4gYmUgZG9uZSB3aXRob3V0IGFscGhhRGF0YSwgZXhjZXB0IGluIEZpcmVmb3ggd2hpY2ggZG9lc24ndCBsaWtlIGl0IHdoZW4gaW1hZ2UgaXMgYmlnZ2VyIHRoYW4gdGhlIGNhbnZhc1xyXG4gICAgdmFyIGltYWdlID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCAwLCB3aWR0aCwgaGVpZ2h0KSxcclxuICAgICAgaW1hZ2VEYXRhID0gaW1hZ2UuZGF0YSxcclxuICAgICAgYWxwaGFEYXRhID0gYnVmZmVyLmdldEltYWdlRGF0YSgwLCBoZWlnaHQsIHdpZHRoLCBoZWlnaHQpLmRhdGE7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDMsIGxlbiA9IGltYWdlRGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgPSBpICsgNCkge1xyXG4gICAgICBpbWFnZURhdGFbaV0gPSBhbHBoYURhdGFbaSAtIDFdICogdmlkZW9PcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dC5wdXRJbWFnZURhdGEoaW1hZ2UsIDAsIDAsIDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gIH07XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGNvbnN0IHtcclxuICAgICAgY2FudmFzRmFsbGJhY2ssXHJcbiAgICAgIHZpZGVvT3BhY2l0eSxcclxuICAgICAgdmlkZW9NYWluLFxyXG4gICAgICB2aWRlb0FscGhhLFxyXG4gICAgICB3cmFwcGVyQ2xhc3NOYW1lLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIGZyYW1lVXBkYXRlSW50ZXJ2YWwsXHJcbiAgICAgIC4uLnByb3BzXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBjb25zdCBvdXRlcldyYXBwZXJDbGFzc25hbWUgPSBbXHJcbiAgICAgIHdyYXBwZXJDbGFzc05hbWUsXHJcbiAgICAgIFwidHJhbnNwYXJlbnRpemUtdmlkZW8tb3V0ZXItd3JhcHBlclwiLFxyXG4gICAgXS5qb2luKFwiIFwiKTtcclxuICAgIGNvbnN0IG91dHB1dENhbnZhc0NsYXNzbmFtZSA9IFtcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBcInRyYW5zcGFyZW50aXplLXZpZGVvLW91dHB1dC1jYW52YXNcIixcclxuICAgIF0uam9pbihcIiBcIik7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHsuLi5wcm9wc30gY2xhc3NOYW1lPXtvdXRlcldyYXBwZXJDbGFzc25hbWV9PlxyXG4gICAgICAgIDxkaXZcclxuICAgICAgICAgIHJlZj17dGhpcy52aWRlb1dyYXBwZXJ9XHJcbiAgICAgICAgICBjbGFzc05hbWU9XCJ0cmFuc3BhcmVudGl6ZS12aWRlby1pbm5lci13cmFwcGVyXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8dmlkZW9cclxuICAgICAgICAgICAgcmVmPXt0aGlzLnZpZGVvTWFpbn1cclxuICAgICAgICAgICAgYXV0b1BsYXlcclxuICAgICAgICAgICAgbG9vcFxyXG4gICAgICAgICAgICBzcmM9e3ZpZGVvTWFpbn1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tbWFpbi12aWRlb1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPHZpZGVvXHJcbiAgICAgICAgICAgIHJlZj17dGhpcy52aWRlb0FscGhhfVxyXG4gICAgICAgICAgICBhdXRvUGxheVxyXG4gICAgICAgICAgICBsb29wXHJcbiAgICAgICAgICAgIHNyYz17dmlkZW9BbHBoYX1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tYWxwaGEtdmlkZW9cIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxjYW52YXNcclxuICAgICAgICAgICAgcmVmPXt0aGlzLmNhbnZhc0J1ZmZlcn1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidHJhbnNwYXJlbnRpemUtdmlkZW8tYnVmZmVyLWNhbnZhc1wiXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPGNhbnZhcyByZWY9e3RoaXMuY2FudmFzT3V0cHV0fSBjbGFzc05hbWU9e291dHB1dENhbnZhc0NsYXNzbmFtZX0+XHJcbiAgICAgICAgICAgIHtjYW52YXNGYWxsYmFja31cclxuICAgICAgICAgIDwvY2FudmFzPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5SZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zLmRlZmF1bHRQcm9wcyA9IHtcclxuICB2aWRlb09wYWNpdHk6IDEsXHJcbiAgZnJhbWVVcGRhdGVJbnRlcnZhbDogNDAsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZWFjdFRyYW5zcGFyZW50aXplVmlkZW9zO1xyXG4iXSwibmFtZXMiOlsiUmVhY3RUcmFuc3BhcmVudGl6ZVZpZGVvcyIsInByb3BzIiwiZnJhbWVVcGRhdGVJbnRlcnZhbCIsIm91dHB1dENhbnZhcyIsImNhbnZhc091dHB1dCIsImN1cnJlbnQiLCJvdXRwdXQiLCJnZXRDb250ZXh0IiwiYnVmZmVyQ2FudmFzIiwiY2FudmFzQnVmZmVyIiwiYnVmZmVyIiwidmlkZW9NYWluIiwidmlkZW9BbHBoYSIsIndyYXBwZXIiLCJ2aWRlb1dyYXBwZXIiLCJ3aWR0aCIsImNsaWVudFdpZHRoIiwiaGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiaW50ZXJ2YWwiLCJwcm9jZXNzRnJhbWUiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xlYXJJbnRlcnZhbCIsInNldEludGVydmFsIiwidmlkZW9PcGFjaXR5IiwiZHJhd0ltYWdlIiwiaW1hZ2UiLCJnZXRJbWFnZURhdGEiLCJpbWFnZURhdGEiLCJkYXRhIiwiYWxwaGFEYXRhIiwiaSIsImxlbiIsImxlbmd0aCIsInB1dEltYWdlRGF0YSIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiaW5pdCIsImNhbnZhc0ZhbGxiYWNrIiwid3JhcHBlckNsYXNzTmFtZSIsImNsYXNzTmFtZSIsIm91dGVyV3JhcHBlckNsYXNzbmFtZSIsImpvaW4iLCJvdXRwdXRDYW52YXNDbGFzc25hbWUiLCJDb21wb25lbnQiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFTUE7Ozs7O0FBQ0oscUNBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQTs7QUFDakIsOEJBQU1BLEtBQU47O0FBRGlCLDJEQWFaLFlBQU07QUFBQSxVQUNIQyxtQkFERyxHQUNxQixNQUFLRCxLQUQxQixDQUNIQyxtQkFERztBQUdYLFVBQUlDLFlBQVksR0FBRyxNQUFLQyxZQUFMLENBQWtCQyxPQUFyQztBQUFBLFVBQ0VDLE1BQU0sR0FBR0gsWUFBWSxDQUFDSSxVQUFiLENBQXdCLElBQXhCLENBRFg7QUFBQSxVQUVFQyxZQUFZLEdBQUcsTUFBS0MsWUFBTCxDQUFrQkosT0FGbkM7QUFBQSxVQUdFSyxNQUFNLEdBQUdGLFlBQVksQ0FBQ0QsVUFBYixDQUF3QixJQUF4QixDQUhYO0FBQUEsVUFJRUksU0FBUyxHQUFHLE1BQUtBLFNBQUwsQ0FBZU4sT0FKN0I7QUFBQSxVQUtFTyxVQUFVLEdBQUcs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
