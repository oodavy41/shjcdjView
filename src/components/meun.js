import React, { Component } from "react";
import styles from "./menu.css";

export default class menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      check: [false, false, false, false, false]
    };
    this.menuTexts = ["虹桥智谷全览", "虹桥智谷东区", "虹桥智谷中区", "虹桥智谷西区", "街道镇", "临空园区"];
  }

  click(index) {
    this.props.switcher(index);
    this.setState({
      check: this.state.check.map((e, i) => {
        return index === i;
      })
    });
  }
  render() {
    return (
      <div className={styles.main}>
        {this.state.check.map((e, i) => {
          return (
            <div key={i} className={`${styles.cell} ${e ? styles.checked : ""}`} onClick={() => this.click(i)}>
              {this.menuTexts[i]}
            </div>
          );
        })}
      </div>
    );
  }
}
