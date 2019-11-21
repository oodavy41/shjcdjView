import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import styles from "./tables.css";

import partyImg from "../assets/imgs/party.png";
import citizenImg from "../assets/imgs/citizen.png";
import historyImg from "../assets/imgs/history.png";
let streets = [
  "北新泾街道",
  "新泾镇",
  "程家桥街道",
  "仙霞新村街道",
  "周家桥街道",
  "天山路街道",
  "虹桥街道",
  "华阳路街道",
  "江苏路街道",
  "新华路街道"
];

let types = ["", "居民党建", "便民生活", "历史保护建筑"];
let classNames = [styles.party, styles.convenient, styles.history];
let imgs = [partyImg, citizenImg, historyImg];

export default class SumTable extends Component {
  render() {
    return (
      <div className={styles.counterMain}>
        <table className={styles.countTable}>
          {types.map((x, i) => {
            return (
              <tr className={`${styles.countTr} ${i > 0 ? classNames[i - 1] : ""}`}>
                <td>
                  <div className={`${styles.trImg}`}></div>
                  {`${x}\n${i > 0 ? this.props.data[3][i - 1] : ""}`}
                </td>
                {i === 0
                  ? streets.map(e => <td className={styles.countTitle}>{e}</td>)
                  : this.props.data[i - 1].map(e => <td className={styles.countTd}>{e}</td>)}
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
