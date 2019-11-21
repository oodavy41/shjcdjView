import React, { Component } from "react";

import List from "./list";
import styles from "./panel.css";

export default class filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cvshow: false,
      listshow: false
    };
  }

  hove(flag) {
    this.change(flag, true);
  }
  leave(flag) {
    this.change(flag, false);
  }

  change(flag, value) {
    switch (flag) {
      case "cvshow":
        this.setState({ cvshow: value });
        break;
      case "listshow":
        this.setState({ listshow: value });
        break;
    }
  }

  render() {
    let { data } = this.props;
    if (Array.isArray(data)) {
      return (
        <div className={`${styles.panel} ${styles.smalllist}`}>
          {data.length}家企业
          {data.map(data => {
            let addr, title;
            if (data.addressType === "人工智能企业") {
              title = data.zckjName;
              addr = data.dtAddress;
            } else {
              title = data.name;
              addr = data.address;
            }
            return <div className={styles.row}>{title}</div>;
          })}
        </div>
      );
    } else if (data.addressType === "众创空间" || data.addressType === "园区") {
      let type = data.addressType === "众创空间" ? styles.area : styles.park;
      let { zckjName: title, buildingImg: imgs, dtAddress: addr, yygsName: name, wzjs: cv, remark, area, qymdList } = data;
      let img = imgs ? imgs.split(",")[0] : "";
      return (
        <div className={`${type} ${styles.panel} ${styles.big}`}>
          <div className={styles.head} style={{ backgroundSize: " 100% 100%", backgroundImage: `url(./building/${img})` }} />
          <div className={styles.title}>{title}</div>
          <div className={styles.info}>
            <p>运营公司名称:{name}</p> <p>地址:{addr}</p> <p>面积:{area}平方米</p> <p>备注:{remark}</p>
          </div>
          <div
            className={`${styles.more} ${styles.cv}`}
            onMouseEnter={() => this.hove("cvshow")}
            onMouseLeave={() => this.leave("cvshow")}
          >
            简介>>
          </div>
          <div
            className={`${styles.more} ${styles.list}`}
            onMouseEnter={() => this.hove("listshow")}
            onMouseLeave={() => this.leave("listshow")}
          >
            入驻企业信息>>
          </div>

          {this.state.cvshow ? <div className={`${styles.moreinfos}`}>{cv}</div> : ""}
          {this.state.listshow ? <List list={qymdList} /> : ""}
        </div>
      );
    } else {
      let addr, title;
      if (data.addressType === "人工智能企业") {
        title = data.zckjName;
        addr = data.dtAddress;
      } else {
        title = data.name;
        addr = data.address;
      }
      return (
        <div className={`${styles.panel} ${styles.small}`}>
          <div className={styles.title}>{title}</div>
          <div className={styles.addr}>{addr}</div>
        </div>
      );
    }
  }
}
