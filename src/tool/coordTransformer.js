var request = require("request");
var fs = require("fs");

let path = require("./streetBorder.json");
let outpath = "streetBorders.json";
let output = [];
let count = 0;

let sleep = time => {
  return new Promise(res => {
    setTimeout(res, time);
  });
};

async function query() {
  for (let index = 0; index < path.length; index++) {
    let { name, array } = path[index];
    array = array[0];
    let arrayT = [];

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
      let lat = element[1];
      let lng = element[0];
      let url = `http://10.207.204.32:8080/visdata/rest/sign/signservice/getCGCS2000ByXY?lat=${lat}&lng=${lng}`;
      let result = await req(encodeURI(url));

      console.log("r", result, element);
      if (result.result) {
        arrayT.push([(result.result.x * 180) / Math.PI, (result.result.y * 180) / Math.PI]);
      } else {
        console.log("error", result, element);
      }

      await sleep(50);
    }
    output.push({ name, array: arrayT });
  }

  console.log("output", output);
  fs.writeFileSync(outpath, JSON.stringify(output));
}

query();
