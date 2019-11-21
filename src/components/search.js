import React, { Component } from "react";
import styles from "./search.css";

export default class search extends Component {
  render() {
    return (
      <div className={`${styles.panel}`}>
        <input
          ref={m => (this.input = m)}
          className={`${styles.input}`}
          type="text"
          onKeyPress={e => {
            console.log(e.keyCode, this.input.value);
            if (e.keyCode == 0) this.props.search(this.input.value);
          }}
        />
      </div>
    );
  }
}
