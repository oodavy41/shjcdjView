import esriLoader from "esri-loader";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import TownTable from "./counter";
import CNTable from "./countTable";
import PopupContent from "./popup";

import bordertownSH from "../datas/streetBorderSH.json";
import borderSH from "../datas/bordersSH.json";

import partyData from "../datas/partyDatasSH.json";
import citizenData from "../datas/citizenDatasSH.json";
import historyData from "../datas/historybuilding.json";
//, "current_name", "address", "construction_area", "construction_age", "sum_building", "value_feature", "cultural_relic_class", "nameplate", "x", "y", "batch", "Street"

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
let streetZoom = [4, 6, 4, 4, 5, 5, 5, 5, 5, 5, 5];
let streetCenter = {};
let streetCounter = {
  北新泾街道: [],
  新泾镇: [],
  程家桥街道: [],
  仙霞新村街道: [],
  周家桥街道: [],
  天山路街道: [],
  虹桥街道: [],
  华阳路街道: [],
  江苏路街道: [],
  新华路街道: []
};
let mapCenter = "";
let partyTypes = ["neighbor", "actcenter", "partybuild"];
let citizenTypes = ["care", "foods", "shop"];
let historyTypes = ["第一批次", "第二批次", "第三批次", "第四批次", "第五批次"];
export default class Polymerization extends Component {
  constructor(props) {
    super(props);
    this.spatialReferencevalue = `PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",-3457147.81],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",121.2751921],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]`;
    this.url = "http://10.207.204.32:9070/arcgis_js_v410_sdk/arcgis_js_api/library/4.10/dojo/dojo.js";
    this.ArcGisGraphic = null;
    this.gridRatio = 100;
    this.view = null;
    this.ons = [];
    this.renderingStack = [];
    this.pointDatas = [];
    this.textDatas = [];
    this.popup = "";
    this.pointsObj = [];
    this.lastData = null;
    this.interval = null;
    this.state = { ready: false };
  }

  componentDidUpdate() {
    let data = this.props.data;
    if (this.state.ready && data.flag && data.flag === "CONSTRUCTOR") {
      if (this.view.updating) {
        console.log("paused@!@");
        this.lastData = data;
        if (this.interval) {
          console.log("clear@!@");
          clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
          if (!this.view.updating) {
            this.updatePoints(this.lastData);
            clearInterval(this.interval);
            this.interval = null;
            console.log("draw@!@");
          }
        }, 200);
      } else {
        this.updatePoints(data, true);
      }
    }
  }

  drawGeometry(geos) {
    this.view.graphics.addMany(geos);
    this.renderingStack = this.renderingStack.concat(geos);
    // console.log(geos, this.renderingStack);
  }

  updatePoints(stateData, cameraCtrl) {
    this.shownState = stateData;
    while (this.renderingStack.length > 0) {
      let popuped = this.renderingStack.pop();
      console.log(popuped.layer.graphics.items.length, this.renderingStack.length);
      this.view.graphics.remove(popuped);
    }

    this.popup && ReactDOM.unmountComponentAtNode(this.popup);

    let rings = [this.maskRings.sh, this.maskRings.cn];
    if (stateData.street !== 0) {
      for (let i = 1; i < streets.length; i++) {
        if (i !== stateData.street) {
          rings.push(this.maskRings[streets[i]]);
        }
      }
    }
    var polygonGraphic = new this.ArcGisGraphic({
      geometry: {
        type: "polygon",
        rings: rings,
        spatialReference: this.spatialReferencevalue
      },
      symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: [67, 160, 71, 0.2],
        outline: {
          // autocasts as new SimpleLineSymbol()
          color: [16, 86, 203, 0.5],
          width: 2,
          style: "dash"
        }
      }
    });
    this.drawGeometry([polygonGraphic]);
    let pointgeos = this.pointDatas.filter(g => {
      let e = g.attributes;
      let result = stateData.street === 0 || streets[stateData.street] === (e.township || e[11]);
      return result;
    });
    this.drawGeometry(pointgeos);

    if (stateData.street !== 0) {
      let textgeos = this.textDatas.filter(g => {
        let e = g.attributes;
        let result = stateData.street === 0 || streets[stateData.street] === e.township;
        let resultP = false;
        partyTypes.forEach((t, i) => {
          resultP = resultP || (t === e.type && stateData.party[i]);
        });
        let resultC = false;
        citizenTypes.forEach((t, i) => {
          resultC = resultC || (t === e.type && stateData.convenient[i]);
        });
        let resultH = false;
        historyTypes.forEach((t, i) => {
          resultH = resultH || (t === e.type && stateData.history[i]);
        });

        return (resultP || resultC || resultH) && result;
      });
      // if (textgeos.length > 10) {
      //   let chance = (Math.sqrt(textgeos.length) + 10) / textgeos.length;
      //   textgeos = textgeos.filter(e => {
      //     return Math.random() < chance;
      //   });
      // }
      this.drawGeometry(textgeos);
    }

    if (cameraCtrl) {
      this.view.zoom = streetZoom[stateData.street];

      if (stateData.street !== 0) {
        let cxy = streetCenter[streets[stateData.street]];
        let center = new this.ArcGisPoint({
          x: cxy[0],
          y: cxy[1],
          spatialReference: {
            wkt: this.spatialReferencevalue
          }
        });
        this.view.center = center;
      } else {
        this.view.center = mapCenter;
      }
    }
  }

  componentDidMount() {
    console.log("didmount", this.view);
    window.getToken();
    this.ws = this.props.ws;

    let pHandle = this.ws.onmessage;

    esriLoader
      .loadModules(
        [
          "esri/views/MapView",
          "esri/Map",
          "esri/core/watchUtils",
          "esri/core/Collection",
          "esri/symbols/TextSymbol",
          "esri/geometry/Circle",
          "esri/identity/IdentityManager",
          "esri/geometry/SpatialReference",
          "esri/layers/FeatureLayer",
          "esri/layers/TileLayer",
          "esri/layers/MapImageLayer",
          "esri/geometry/Extent",
          "esri/geometry/Point",
          "esri/symbols/SimpleMarkerSymbol",
          "esri/symbols/PictureMarkerSymbol",
          "esri/Graphic",
          "esri/PopupTemplate",
          "esri/renderers/ClassBreaksRenderer",
          "esri/layers/GraphicsLayer",
          "esri/symbols/SimpleLineSymbol",
          "esri/symbols/SimpleFillSymbol",
          "esri/Color",
          "esri/renderers/SimpleRenderer",
          "esri/views/2d/draw/Draw",
          "dojo",
          "esri/geometry/geometryEngine",
          "esri/config",
          "esri/geometry/Polygon"
        ],
        { url: this.url }
      )
      .then(
        ([
          MapView,
          Map,
          watchUtils,
          Collection,
          TextSymbol,
          Circle,
          IdentityManager,
          SpatialReference,
          FeatureLayer,
          ArcGISTiledMapServiceLayer,
          ArcGISDynamicMapServiceLayer,
          Extent,
          Point,
          SimpleMarkerSymbol,
          PictureMarkerSymbol,
          Graphic,
          PopupTemplate,
          ClassBreaksRenderer,
          GraphicsLayer,
          SimpleLineSymbol,
          SimpleFillSymbol,
          Color,
          SimpleRenderer,
          Draw,
          dojo,
          geometryEngine,
          esriConfig,
          Polygon
        ]) => {
          this.ArcGisColletion = Collection;
          this.ArcGisPoint = Point;
          this.ArcGisGraphic = Graphic;
          esriConfig.fontsUrl = "http://10.207.204.32:9070/arcgisapi-master/fonts";
          let spatialReferencevalue = this.spatialReferencevalue;
          // 定义地图
          this.map = new Map({});
          this.view = new MapView({
            container: "mapDiv",
            map: this.map,
            showLabels: true,
            center: [121.41802145766225, 31.21819924364435],
            extent: new Extent({
              type: "extent",
              xmax: 2116.0772399670277,
              xmin: -18203.963400114255,
              ymax: -16.55708170044818,
              ymin: -5731.568511723309,
              spatialReference: {
                wkt: spatialReferencevalue
              }
            }),
            sliderPosition: "bottom-right",
            sliderOrientation: "horizontal",
            // sliderStyle:'small',
            zoom: 4
          });
          mapCenter = this.view.center;

          var token = document.getElementById("txtToken").value;
          IdentityManager.registerToken({
            server: "http://map.cn.gov/OneMapServer/rest/services",
            token
          });
          var tiledLayer = new ArcGISTiledMapServiceLayer({
            url: "http://map.cn.gov/OneMapServer/rest/services/BASEMAP/MapServer",
            id: "baseMap"
          });
          this.map.add(tiledLayer);

          var sh = {
            xmax: 70000.0772399670277,
            xmin: -70203.963400114255,
            ymax: 70000.55708170044818,
            ymin: -70000.568511723309
          };
          sh = [
            [sh.xmin, sh.ymin],
            [sh.xmin, sh.ymax],
            [sh.xmax, sh.ymax],
            [sh.xmax, sh.ymin]
          ];
          var cn = bordertownSH.map(e => e.array[0]);
          let borderRings = [sh, borderSH["长宁区"], ...cn];
          this.maskRings = {
            sh,
            cn: borderSH["长宁区"]
          };
          bordertownSH.forEach(e => {
            this.maskRings[e.name] = e.array[0];
            let sx = 0,
              sy = 0;
            e.array[0].forEach(e => {
              sx += e[0];
              sy += e[1];
            });
            sx /= e.array[0].length;
            sy /= e.array[0].length;
            streetCenter[e.name] = [sx, sy];
            streetCounter[e.name] = [0, 0, 0];
          });

          partyData.forEach(e => {
            streetCounter[e.township] && (streetCounter[e.township][0] += 1);
          });
          citizenData.forEach(e => {
            streetCounter[e.township] && (streetCounter[e.township][1] += 1);
          });
          historyData.forEach(e => {
            streetCounter[e[11]] && (streetCounter[e[11]][2] += 1);
          });
          this.streetCount = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0]
          ];
          streets.forEach((e, i) => {
            if (i > 0) {
              i = i - 1;
              this.streetCount[0][i] = streetCounter[e][0];
              this.streetCount[3][0] += streetCounter[e][0];
              this.streetCount[1][i] = streetCounter[e][1];
              this.streetCount[3][1] += streetCounter[e][1];
              this.streetCount[2][i] = streetCounter[e][2];
              this.streetCount[3][2] += streetCounter[e][2];
            }
          });

          let addPoints = (array, color, size) => {
            let graps = [],
              texts = [];
            array.forEach(e => {
              let geo = {
                type: "point",
                x: (e.SHXY && e.SHXY[0]) || e[8],
                y: (e.SHXY && e.SHXY[1]) || e[9],
                spatialReference: this.spatialReferencevalue
              };
              let attributes = {
                name: e[0] || e.name.split("（")[0],
                addr: e[1] || e.addr,
                type: e.type || e[10],
                township: e.township || e[11],
                phone: e.phone,
                birth: e.birth,
                color: color
              };
              if (!attributes.name) {
                return;
              }
              let t = new this.ArcGisGraphic({
                attributes: attributes,
                geometry: geo,
                symbol: {
                  type: "text",
                  color: "white",
                  haloColor: color,
                  haloSize: "10px",
                  text: attributes.name,
                  xoffset: 4,
                  yoffset: 6,
                  font: {
                    family: "microsoft-yahei",
                    size: 12
                  }
                }
              });
              texts.push(t);
              let p = new this.ArcGisGraphic({
                attributes: attributes,
                geometry: geo,
                symbol: {
                  type: "simple-marker",
                  color: color,
                  size: size,
                  outline: { width: 0.5 }
                }
              });
              graps.push(p);
            });
            return [graps, texts];
          };

          let partyGrap = addPoints(partyData, "#aa3300", 5),
            citizenGrap = addPoints(citizenData, "#43A047", 5),
            historyGrap = addPoints(historyData, "#6D4747", 5);
          this.pointDatas = [...partyGrap[0], ...citizenGrap[0], ...historyGrap[0]];
          this.textDatas = [...partyGrap[1], ...citizenGrap[1], ...historyGrap[1]];

          this.view.ui.components = [];

          this.view.when(() => {
            console.log("when");
            this.setState({ ready: true });
            let data = this.props.data;
            if (data.flag && data.flag === "CONSTRUCTOR") {
              this.updatePoints(data, true);
            }
            ["drag", "mouse-whell", "double-click"].forEach(e => {
              this.ons.push(
                this.view.on(e, event => {
                  this.cameraModifyed = true;
                })
              );
            });

            watchUtils.whenTrue(this.view, "stationary", () => {
              if (this.cameraModifyed) {
                this.cameraModifyed = false;
                this.updatePoints(this.props.data, false);
              }
            });

            this.view.popup.autoOpenEnabled = false;

            this.ons.push(
              this.view.on("click", e => {
                this.view.hitTest(e).then(result => {
                  if (result.results.length > 0) {
                    let objGraphic = result.results[0].graphic;
                    let attr = objGraphic.attributes;
                    var mapPoint = result.results[0].mapPoint;
                    this.view.popup.open({
                      location: mapPoint,
                      content: this.popupFactory(attr)
                    });
                  }
                });
              })
            );

            this.setState({});
          });
        }
      );
  }

  popupFactory(data) {
    this.popup && ReactDOM.unmountComponentAtNode(this.popup);
    if (data) {
      this.popup = document.createElement("div");
      ReactDOM.render(<PopupContent data={data} />, this.popup);
    }
    return this.popup;
  }

  compomentWillUnmount() {
    this.ons.forEach(e => e.remove());
    this.view.graphics.removeAll();
    this.map.removeAll();
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div id="mapDiv" style={{ width: "100%", height: "100%" }} {...this.props} />
        <div style={{ position: "fixed", top: 20, right: 100, fontSize: 50, color: "#424242" }}>
          {streets[this.props.data.street]}
        </div>
        {this.streetCount ? (
          this.props.data.street === 0 ? (
            <CNTable data={this.streetCount}></CNTable>
          ) : (
            <TownTable
              data={[
                this.streetCount[0][this.props.data.street - 1],
                this.streetCount[1][this.props.data.street - 1],
                this.streetCount[2][this.props.data.street - 1]
              ]}
            ></TownTable>
          )
        ) : (
          ""
        )}
      </div>
    );
  }
}
