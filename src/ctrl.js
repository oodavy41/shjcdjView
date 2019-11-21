import "./ctrl.html";
import styles from "./ctrl.css";

import backIco from "./assets/imgs/back.svg";

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

let streets = [
  "全览",
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
let chosen = [
  { name: "居民党建", stateName: "party", className: styles.party, switch: ["居委会", "居民活动室", "党建服务中心"] },
  { name: "便民生活", stateName: "convenient", className: styles.convenient, switch: ["美容美发", "餐饮酒店", "社区小店"] },
  {
    name: "历史保护建筑",
    stateName: "history",
    className: styles.history,
    switch: ["第一批次", "第二批次", "第三批次", "第四批次", "第五批次"]
  }
];
export default class CtrlPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chosen: -1,
      renwen: false,
      street: 0,
      party: chosen[0].switch.map(e => false),
      convenient: chosen[1].switch.map(e => false),
      history: chosen[2].switch.map(e => false)
    };
  }

  componentDidMount() {
    this.ws = this.props.ws;
  }

  postWS(data) {
    if (this.ws.readyState) {
      data = JSON.stringify(data);
      this.ws.send(data);
    }
  }
  componentDidUpdate() {
    if (this.ws && this.state.renwen) {
      let data = { flag: "CONSTRUCTOR", ...this.state, url: "/arcgis" };
      this.postWS(data);
    }
  }

  threeCtrl(url) {
    this.postWS({ flag: "MAINPANEL", url: url });
  }

  render() {
    return (
      <div className={`${styles.main}`}>
        {this.state.renwen ? (
          <div>
            <div className={`${styles.title}`}>长宁区人文地图</div>
            <div
              className={`${styles.subtitle}`}
              onClick={() => {
                this.setState({ renwen: false });
                this.threeCtrl("/");
              }}
            >
              <img src={backIco} className={`${styles.subIco}`} />
            </div>
            <div className={`${styles.streetDiv}`}>
              {streets.map((e, i) => (
                <div
                  key={i}
                  className={`${styles.streetCell} ${this.state.street == i ? styles.streetChosen : ""}`}
                  onClick={() => {
                    this.setState({ street: i });
                  }}
                >
                  {e}
                </div>
              ))}
              <div className={`${styles.switchDiv}`}>
                {chosen.map((e, i) => (
                  <div key={i} className={`${styles.switchType} ${e.className}`}>
                    <div className={`${styles.choosesTitle}`}>{e.name}</div>
                    <div className={`${styles.chooses}`}>
                      {e.switch.map((ec, ic) => (
                        <div
                          key={ic}
                          className={`${styles.choosesCell} ${this.state[e.stateName][ic] ? styles.chosenCell : ""}`}
                          onClick={() => {
                            let arr = this.state[e.stateName];
                            arr[ic] = !arr[ic];
                            this.setState({ [e.stateName]: arr });
                          }}
                        >
                          {ec}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.threeToOne}>
            <div className={styles.threeTitle}>长宁区大数据平台</div>
            <div
              className={`${styles.threeBtn} ${this.state.chosen === 0 ? styles.highLight : ""}`}
              onClick={() => {
                this.threeCtrl("/arcgis");
                this.setState({ chosen: 0, renwen: true });
              }}
            >
              <div className={styles.toRenwen}> </div>
              <div className={styles.btnText}>人文地图</div>
            </div>
            <div
              className={`${styles.threeBtn} ${this.state.chosen === 1 ? styles.highLight : ""}`}
              onClick={() => {
                this.threeCtrl("/amap");
                this.setState({ chosen: 1 });
              }}
            >
              <div className={styles.toCydt}> </div>
              <div className={styles.btnText}>产业地图</div>
            </div>
            <div
              className={`${styles.threeBtn} ${this.state.chosen === 2 ? styles.highLight : ""}`}
              onClick={() => {
                this.threeCtrl("/wgzx");
                this.setState({ chosen: 2 });
              }}
            >
              <div className={styles.toWgzx}> </div>
              <div className={styles.btnText}>网格地图</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
