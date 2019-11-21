import React, { Component } from "react";
import bg from "../assets/icons/title.png";

export default class title extends Component {
  render() {
    let style = {
      zIndex: 1000,
      width: "1000px",
      height: "50px",
      position: "absolute",
      left: "500px",
      top: "40px",
      backgroundImage: `url(${bg})`,
      backgroundSize: "100% 100%"
    };

    return <div style={style} />;
  }
}
