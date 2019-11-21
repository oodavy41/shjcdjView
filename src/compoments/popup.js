import React, { Component } from "react";
import styles from "./popup.css";

export default class AlertPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    let { data } = this.props;
    console.log(data, "popup");
    return (
      <div
        className={styles.popupMain}
        style={{
          backgroundColor: data.color
        }}
      >
        <h3>{data.name}</h3>
        <ul>
          <li>地址：{data.addr}</li>
          {data.phone ? <li>联系方式：{data.phone}</li> : <li>建造年代：{data.birth}</li>}
        </ul>
      </div>
    );
  }
}
