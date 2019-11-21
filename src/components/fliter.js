import React, { Component } from "react";
import styles from "./fliter.css";

export default class fliter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: [true, true, true, true]
    };
  }
  onclick(index) {
    let { marks } = this.props;
    let value = this.state.flag;
    value[index] = !value[index];
    if (value[index]) {
      marks[index].show();
    } else {
      marks[index].hide();
    }
    this.setState({ flag: value });
  }
  componentDidUpdate() {}

  render() {
    let { marks } = this.props;
    return (
      <div className={styles.fliter}>
        <div className={styles.row}>
          {this.state.flag[3] ? <div className={`${styles.PARK} ${styles.led}`} /> : ""}
          <div className={`${styles.PARK} ${styles.parkBg} ${styles.text}`} onClick={() => this.onclick(3)}>
            <div className={styles.left}>科技园区</div>
            <div className={styles.right}>{marks[3].count}</div>
          </div>
        </div>

        {/* <div className={styles.row}>
          {this.state.flag[1] ? <div className={`${styles.ADD} ${styles.led}`} /> : ""}
          <div className={`${styles.ADD} ${styles.addBg} ${styles.text}`} onClick={() => this.onclick(1)}>
            <div className={styles.left}>互+生企业</div>
            <div className={styles.right}>{marks[1].count}</div>
          </div>
        </div> */}
        <div className={styles.row}>
          {this.state.flag[2] ? <div className={`${styles.AREA} ${styles.led}`} /> : ""}
          <div className={`${styles.AREA} ${styles.areaBg} ${styles.text}`} onClick={() => this.onclick(2)}>
            <div className={styles.left}>众创空间</div>
            <div className={styles.right}>{marks[2].count}</div>
          </div>
        </div>
        <div className={styles.row}>
          {this.state.flag[0] ? <div className={`${styles.AI} ${styles.led}`} /> : ""}
          <div className={`${styles.AI} ${styles.aiBg} ${styles.text}`} onClick={() => this.onclick(0)}>
            <div className={styles.left}>AI企业 </div>
            <div className={styles.right}>{marks[0].count}</div>
          </div>
        </div>
      </div>
    );
  }
}
