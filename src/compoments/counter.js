import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import styles from "./tables.css";

import partyImg from "../assets/imgs/party.png";
import citizenImg from "../assets/imgs/citizen.png";
import historyImg from "../assets/imgs/history.png";

let types = ["居民党建", "便民生活", "历史保护建筑"];
let classNames = [styles.party, styles.convenient, styles.history];
let imgs = [partyImg, citizenImg, historyImg];

export default class StreetCounter extends Component {
  render() {
    return (
      <div className={styles.counterMain}>
        {types.map((e, i) => {
          return (
            <div className={`${styles.counterCell} ${classNames[i]}`}>
              <div className={styles.counterImg}></div>
              <div className={styles.counterTitle}>{e}</div>
              <div className={styles.counterNum}>{this.props.data[i]}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
