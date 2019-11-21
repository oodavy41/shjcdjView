import "./amap.html";

import aidata from "./datas/AIouttown.json";
import areadata from "./datas/areaoutown.json";
import newdata from "./datas/newouttown.json";
import camdata from "./datas/lnglatDatas.json";
import streetraw from "./datas/streetBorders.json";

import area from "./assets/icons/areaC.png";
import park from "./assets/icons/park.png";
import headImg from "./assets/icons/topbg.png";

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

import { loadMap, loadPlugin } from "react-amap-next/lib/api";
import Map from "react-amap-next/lib/Map";
import Fliter from "./components/fliter";
import Marker from "./components/marker";

import Title from "./components/title";
import Menu from "./components/meun";
import Search from "./components/search";

let alpha = 0.2;
let newC = `rgba(0,122,255,${alpha})`;
let aiC = `rgba(232,84,30,${alpha})`;
let parkC = `rgba(255,149,0,${alpha})`;
let areaC = `rgba(0,255,253,${alpha})`;

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: 0,
      AMap: null,
      mapLevel: 0
    };
    this.mapOrigin = {
      mapStyle: "amap://styles/82404b2fff370681e0bd7ef156c784e2",
      resizeEnable: true,
      rotateEnable: true,
      zoomEnable: true,
      doubleClickZoom: false,
      rightClick: false,
      expandZoomRange: false,
      showIndoorMap: false,
      buildingAnimation: true,
      zoom: 14,
      center: [121.390814, 31.205524],
      viewMode: "3D",
      features: ["road", "bg", "building"]
    };
    this.Map = null;
    this.scene = null;
    this.menu = null;
    this.markerCollection = [];
  }

  async componentDidMount() {
    let AMap = await loadMap("67b4b19e0b19792352244afd39397457");
    await loadPlugin("AMap.MarkerClusterer");
    await loadPlugin("AMap.DistrictSearch");

    this.setState({
      AMap: AMap,
      ready: 1
    });

    let border = await this.addborder(AMap);
    let masks = this.addMask(AMap);

    let streetdata = streetraw.map(e => {
      return {
        ...e,
        array: e.array.map(e => {
          return [e[0] + 0.0045, e[1] - 0.0018];
        })
      };
    });
    this.streets = new AMap.OverlayGroup();
    streetdata.forEach((e, i) => {
      this.addborderSync(e.array, e.name, `rgba(${60 + i * 8},${140 - i * 8},${255 - i * 13},0.9)`, AMap, this.streets);
    });
    this.Map.add(this.streets);
    this.streets.hide();

    let parkD = areadata.filter(e => {
      return e.addressType === "园区";
    });
    let areaD = areadata.filter(e => {
      return e.addressType === "众创空间";
    });
    this.aiM = this.addcluster(aiC, aidata, AMap, 800);
    // this.newM = this.addcluster(newC, newdata, AMap,800);

    this.areaM = this.addmarker(area, areaD, AMap, 900);
    this.parkM = this.addmarker(park, parkD, AMap, 1000);

    this.clipBorder = this.addcliper(AMap);
    this.Map.add(this.clipBorder);

    this.setState({
      ready: 2
    });
  }

  async componentDidUpdate() {}

  addmarker(img, data, AMap, baseLevel) {
    let collection = this.markerCollection;
    let markers = data.map((e, i) => {
      let str = e.location;
      let coord = str.split(",");
      let div = document.createElement("div");
      div.style.cssText = `background: url(${img}) no-repeat;background-size:cover; height: 20px; width: 20px;z-index:50;`;
      let reactMarker = ReactDOM.render(<Marker data={e} defLevel={baseLevel} key={i} />, div);
      let marker = new AMap.Marker({
        position: [+coord[0], +coord[1]],
        content: div,
        offset: new AMap.Pixel(-10, -10),
        zIndex: baseLevel,
        extData: e
      });
      collection.push(ReactDOM.render(<Marker data={e} defLevel={baseLevel} parent={marker} key={i} />, div));
      return marker;
    });

    let group = new AMap.OverlayGroup(markers);
    this.Map.add(group);
    group["count"] = markers.length;
    return group;
  }

  addcluster(color, data, AMap, baseLevel) {
    let collection = this.markerCollection;
    let markers = data.map((e, i) => {
      let str = e.location;
      let coord = str.split(",");
      let div = document.createElement("div");
      div.style.cssText = `background-color: ${color}; height: 24px; width: 24px; border: 1px solid ${color}; border-radius: 12px; box-shadow: ${color} 0px 0px 1px;`;
      ReactDOM.render(<Marker data={e} />, div);
      let marker = new AMap.Marker({
        position: [+coord[0], +coord[1]],
        content: div,
        offset: new AMap.Pixel(-15, -15),
        zIndex: 60,
        extData: e
      });
      collection.push(ReactDOM.render(<Marker data={e} defLevel={baseLevel} parent={marker} key={i} />, div));
      return marker;
    });
    let count = markers.length;
    let cluster = new AMap.MarkerClusterer(this.Map, markers, {
      gridSize: 80,
      zoomOnClick: false,
      renderClusterMarker: context => {
        var factor = Math.pow(context.count / count, 1 / 18);
        var div = document.createElement("div");
        div.style.backgroundColor = color;
        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + "px";
        div.style.border = "solid 2px " + color;
        div.style.borderRadius = (size + 4) / 2 + "px";
        div.style.boxShadow = "0 0 1px " + color;
        div.innerHTML = context.count;
        div.style.lineHeight = size + "px";
        div.style.color = "#ffffff";
        div.style.fontSize = "14px";
        div.style.textAlign = "center";
        div.style.zIndex = 50;
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        ReactDOM.render(
          <Marker
            data={context.markers.map(e => {
              return e.B.extData;
            })}
            defLevel={baseLevel}
            parent={context.marker}
            key={Math.random()}
          />,
          div
        );

        context.marker.setContent(div);
      }
    });
    return {
      count: markers.length,
      markers,
      cluster,
      show: function() {
        cluster.addMarkers(markers);
      },
      hide: function() {
        cluster.clearMarkers();
      }
    };
  }

  addborder(AMap) {
    let districtSearcher = new AMap.DistrictSearch({
      extensions: "all",
      level: "province"
    });
    return new Promise((resolve, reject) => {
      districtSearcher.search("长宁区", (status, result) => {
        var bounds = result.districtList[0].boundaries;
        if (bounds) {
          var polygons = bounds.map(v => {
            return new AMap.Polyline({
              map: this.Map,
              strokeWeight: 3,
              path: v,
              strokeStyle: "dashed",
              strokeColor: "rgba(150,255,255,0.9)"
            });
          });
        }
        let cnMask = new AMap.OverlayGroup(polygons);
        this.Map.add(cnMask);
        resolve(cnMask);
      });
    });
  }

  addborderSync(array, name, color, AMap, group) {
    let border = new AMap.Polygon({
      map: this.Map,
      zIndex: 20,
      strokeWeight: 3,
      path: array,
      strokeStyle: "solid",
      strokeColor: color,
      fillColor: color,
      fillOpacity: 0.2
    });

    let x = 0,
      y = 0;
    array.forEach(e => {
      x += e.lng;
      y += e.lat;
    });
    x /= array.length;
    y /= array.length;

    let text = new AMap.Text({
      text: name,
      map: this.Map,
      zIndex: 21,
      position: new AMap.LngLat(x, y),
      style: {
        background: "none",
        border: "none",
        fontSize: 18,
        color: "#aef"
      }
    });
    console.log(name, `[${x},${y}]`);

    border.on("click", e => {
      this.Map.setZoom(15);
      this.Map.setCenter([x, y]);
      this.streets.hide();
      this.marksCtrl(true);
    });
    border.on("mouseover", e => {
      e.target.setOptions({ fillOpacity: 0.5 });
    });
    border.on("mouseout", e => {
      e.target.setOptions({ fillOpacity: 0.2 });
    });

    group.add(border);
    group.add(text);
  }

  async addMask(AMap) {
    let districtSearcher = new AMap.DistrictSearch({
      extensions: "all",
      level: "biz_area",
      subdistrict: 3
    });

    let fillcolor = "#002244";
    let fillopacity = 0.6;
    let maskNames = ["上海市", "长宁区"];

    let masks = await Promise.all(
      maskNames.map(e => {
        return new Promise((resolve, reject) => {
          districtSearcher.search(e, (status, result) => {
            console.log(e, result);
            if (result) {
              resolve(result);
            } else {
              console(e, "FAILED");
              reject("!!!");
            }
          });
        });
      })
    );
    console.log(masks);
    let polygons = masks.map((result, index) => {
      let e;
      if (!index) {
        e = result.districtList[0].boundaries;
        e = e[0].concat(e[8]);
      } else {
        e = result.districtList[0].boundaries[0];
      }
      return e.map(e => new AMap.LngLat(e.lng, e.lat));
    });
    console.log(polygons);
    let mask = new AMap.Polygon({
      map: this.Map,
      bubble: true,
      path: polygons,
      strokeOpacity: 0,
      fillColor: fillcolor,
      fillOpacity: fillopacity
    });
    let cnMask = new AMap.OverlayGroup(mask);
    this.Map.add(cnMask);
    return cnMask;
  }

  addcliper(AMap) {
    let points = camdata.areaBorder.map(v => {
      return new AMap.Polyline({
        map: this.Map,
        strokeWeight: 3,
        path: v,
        strokeStyle: "dashed",
        strokeColor: "rgba(80, 200, 150, 0.9)"
      });
    });

    return new AMap.OverlayGroup([points[0], points[1]]);
  }

  switchCamera(index) {
    let all = {
        zoom: 14,
        center: [121.390814, 31.205524]
      },
      east = {
        zoom: 15,
        center: camdata.areaLocation[0]
      },
      center = {
        zoom: 15,
        center: camdata.areaLocation[1]
      },
      west = {
        zoom: 14,
        center: camdata.areaLocation[2]
      },
      linkong = {
        zoom: 15,
        center: camdata.areaLocation[3]
      },
      streets = {
        zoom: 14,
        center: [121.390814, 31.205524]
      };
    let switcher = [all, east, center, west, streets];
    console.log(index);
    if (index < switcher.length) {
      this.Map.setZoom(switcher[index].zoom);
      this.Map.setCenter(switcher[index].center);
      if (index == 4) {
        this.streets.show();
        this.marksCtrl(false);
      } else {
        this.streets.hide();
        this.marksCtrl(true);
      }
    }
  }

  marksCtrl(flag) {
    let marks = [this.aiM, this.newM, this.areaM, this.parkM];
    if (!flag) {
      marks.forEach(e => e && e.hide());
    } else {
      marks.forEach(e => e && e.show());
    }
  }

  focuse(center, zoom = 18) {
    this.Map.setZoom(zoom);
    this.Map.setCenter(center);
  }

  search(text) {
    let result = this.markerCollection.filter(e => {
      let name = e.props.data.zckjName || e.props.data.name;
      return name.match(text);
    });
    console.log("result", result);
    let marker = result[0];
    if (marker) {
      result = marker.props.data;
      !marker.state.showPanel && marker.onClick();
      this.focuse(result.location.split(","));
    }
  }

  gc() {
    this.markerCollection = this.markerCollection.filter(e => {
      return e.props.parent.Ge.content && e.props.parent.Ge.content.closest(".amap-markers");
    });
  }

  render() {
    if (this.state.ready > 0) {
      return (
        <div style={{ width: "1920px", height: "1080px" }}>
          {this.state.ready > 1 ? <Fliter marks={[this.aiM, this.newM, this.areaM, this.parkM]} /> : ""}
          <Map
            refer={mine => {
              this.Map = mine;
            }}
            AMap={AMap => this.setState({ AMap: AMap })}
            style={{ width: "1920px", height: "1080px" }}
            options={this.mapOrigin}
            events={{}}
          >
            <div
              style={{
                zIndex: 1000,
                pointerEvents: "none",
                zIndex: 1,
                background: `url(${headImg})`,
                backgroundSize: "contain",
                position: "absolute",
                width: "100%",
                height: "150px"
              }}
            />
            <Menu switcher={i => this.switchCamera(i)} />
            <Title />
            <Search search={text => this.search(text)} />
          </Map>
        </div>
      );
    } else {
      return <div />;
    }
  }
}
