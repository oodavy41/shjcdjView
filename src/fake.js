import "./ctrl.html";
import styles from "./ctrl.css";

import backIco from "./assets/imgs/back.svg";

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
export default class FakePanel extends Component {
  render() {
    return (
      <div className={`${styles.main}`}>
        <div className={styles.threeToOne}>
          <div className={styles.threeTitle} style={{ fontSize: 120 }}>
            长宁区大数据平台
          </div>
        </div>
      </div>
    );
  }
}
