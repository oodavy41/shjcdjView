import "./index.html";

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { createHashHistory } from "history";

import "./tools/location";
import Amap from "./amap.js";
import Ctrl from "./ctrl.js";
import Wgzx from "./wgzx.js";
import Main from "./fake.js";

import ArcgisP from "./compoments/Polymerization";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: document.location.hash.slice(1)
    };
    this.ws = new WebSocket("ws://10.207.204.32:5890/websocket");
    this.history = createHashHistory({ forceRefresh: true });
  }

  componentDidMount() {
    this.ws.onopen = function(e) {
      console.log(e, "连接服务器成功");
    };
    this.ws.onclose = function(e) {
      console.log("服务器关闭");
    };
    this.ws.onerror = function() {
      console.log("连接出错");
    };
    this.ws.onmessage = e => {
      let data = JSON.parse(e.data);

      if (this.state.path !== "/ctrl") {
        if (data.flag) {
          this.history.push(data.url);
          switch (data.flag) {
            case "MAINPANEL":
              if (data.street) {
                this.arcgisdata = data;
              }
              this.setState({ path: data.url });

              break;
            case "CONSTRUCTOR":
              this.arcgisdata = data;
              this.setState({ path: "/arcgis" });

              break;

            default:
              break;
          }
        }
      }
    };
  }

  componentDidUpdate() {}

  render() {
    return (
      <Router history={this.history}>
        <Switch>
          <Route
            path="/ctrl"
            render={props => <Ctrl {...props} ws={this.ws} />}
          />
          <Route
            path="/amap"
            render={props => <Amap {...props} ws={this.ws} />}
          />
          <Route
            path="/arcgis"
            render={props => (
              <ArcgisP
                ws={this.ws}
                data={
                  this.arcgisdata || {
                    street: 0,
                    party: [false, false, false],
                    convenient: [false, false, false],
                    history: [false, false, false, false, false]
                  }
                }
              />
            )}
          />
          <Route
            path="/wgzx"
            render={props => <Wgzx {...props} ws={this.ws} />}
          />
          <Route path="/" render={props => <Main {...props} ws={this.ws} />} />
        </Switch>
      </Router>
    );
  }
}

let container = document.createElement("div");
container.style.height = "1080px";
document.body.appendChild(container);
document.body.style.margin = "0px";
ReactDOM.render(<Home />, container);
