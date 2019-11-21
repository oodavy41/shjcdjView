import React, { Component } from "react";
import styles from "./list.css";

export default class filter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { list } = this.props;
    return (
      <div className={styles.list}>
        <h4>入驻企业{list.length}个</h4>
        {list.map(e => {
          return <div className={styles.row}>{e.qyName}</div>;
        })}
      </div>
    );
  }
}
