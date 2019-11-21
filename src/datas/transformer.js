var request = require("request");
var fs = require("fs");

let inpath = ["src/datas/citizenDatas.json", "src/datas/partyDatas.json"];
let outpath = ["src/datas/citizenDatasSH.json", "src/datas/partyDatasSH.json"];

let sleep = time => {
  return new Promise(res => {
    setTimeout(res, time);
  });
};

async function query() {
  for (let pos = 0; pos < 2; pos++) {
    let array = JSON.parse(fs.readFileSync(inpath[pos], "utf8"));
    let output = {};
    let count = 0;

    for (let i = 0; i < array.length; i++) {
      let element = array[i];
      let req = url => {
        return new Promise((resolve, reject) => {
          request(url, (e, res, body) => {
            if (e) {
              reject(e);
              console.log("error", e);
            } else {
              body = JSON.parse(body.toString());
              resolve(body);
            }
          });
        });
      };
      element = element.location.split(",");
      let lng = +element[0] - 0.0045;
      let lat = +element[1] + 0.0018;
      // let url = `http://10.207.204.32:8080/visdata/rest/sign/signservice/getCGCS2000ByXY?lat=${lat}&lng=${lng}`;
      let url = `http://10.207.204.32:8080/visdata/rest/sign/signservice/gettype?type=3&lat=${lat}&lng=${lng}`;
      let result = await req(encodeURI(url));

      console.log("resultttt", element, result);
      if (result.result) {
        // arrayT.push([(result.result.x * 180) / Math.PI, (result.result.y * 180) / Math.PI]);
        array[i].SHXY = [result.result.x, result.result.y];
      } else {
        console.log("error", result, element);
      }
    }
    console.log("output", array);
    fs.writeFileSync(outpath[pos], JSON.stringify(array));
  }
}

query();
