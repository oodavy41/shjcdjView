import React, { Component } from "react";
import parkName from "../assets/icons/parkname.png";
import ai from "../assets/icons/ai.png";
import Panel from "./panel";
export default class filter extends Component {
  static popuped = null;
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false
    };
  }

  onClick() {
    this.props.parent && this.props.parent.setzIndex(this.state.showPanel ? this.props.defLevel : 5000);
    this.setState({ showPanel: !this.state.showPanel });
    if (filter.popuped && filter.popuped !== this && filter.popuped.state.showPanel) {
      filter.popuped.onClick();
    }
    filter.popuped = this;
    console.log(filter.popuped);
  }

  render() {
    let { data } = this.props;
    let bgicon = !data.addressType
      ? {
          backgroundImage: `url(${ai})`,
          backgroundPositionX: "center",
          backgroundPositionY: "center",
          backgroundSize: "70% 70% ",
          backgroundRepeat: "no-repeat"
        }
      : {};
    let divstyle = {
      ...{
        width: "100%",
        height: "100%",
        zIndex: 2000
      },
      ...bgicon
    };
    return (
      <div
        className={"Search_Marker"}
        style={divstyle}
        onClick={e => {
          this.onClick();
        }}
      >
        {!Array.isArray(data) && data.addressType === "园区" ? (
          <div
            style={{
              backgroundImage: `url(${parkName})`,
              backgroundSize: "100% 100%",
              color: "#FFA500",
              fontSize: "21px",
              wordBreak: "keep-all",
              whiteSpace: "nowarp",
              lineHeight: "25px",
              padding: "5px",
              height: "auto",
              width: "auto",
              position: "absolute",
              left: `-${data.zckjName.length * 10 - 5}px`,
              bottom: "110%",
              boxShadow: "inset -2px 0 11px 11px rgba(102,65,12,0.45);"
            }}
          >
            {data.zckjName}
          </div>
        ) : (
          ""
        )}
        {this.state.showPanel ? <Panel data={data} /> : ""}
      </div>
    );
  }
}
