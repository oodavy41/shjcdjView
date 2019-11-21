import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import cydtVideo from "./assets/video/video_x264.mp4";

export default class Video extends Component {
  componentDidMount() {
    if (this.videoEle) {
      this.videoEle.play();
      console.log("play");
    }
    this.videoEle.addEventListener("canplay", event => {
      this.videoEle.play();
    });
  }
  render() {
    return (
      <video
        ref={e => {
          this.videoEle = e;
        }}
        style={{ position: "absolute", zIndex: 999999, left: 0, top: 0, width: "100%", height: "100%" }}
        src={cydtVideo}
        autoPlay="autoplay"
        loop="loop"
      />
    );
  }
}
