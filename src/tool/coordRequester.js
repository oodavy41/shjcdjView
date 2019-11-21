var request = require("request");
var fs = require("fs");

let path = require("./new.json");
let outpath = "newouttown.json";
let output = [];
let count = 0;

let sleep = time => {
  return new Promise(res => {
    setTimeout(res, time);
  });
};

async function query() {
  for (let index = 0; index < path.length; index++) {
    let element = path[index];

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

    let addr = element.address;
    let amapUrlL = `http://restapi.amap.com/v3/geocode/geo?key=7f9503b5a170e3832e08c1a233096cb5&address=${addr}&city=上海`;
    let result0 = await req(encodeURI(amapUrlL));
    if (!result0.geocodes) {
      console.log("FAILED addr", result0, element);
    }
    let location = result0.geocodes[0].location;
    await sleep(300);

    let amapUrl = `http://restapi.amap.com/v3/geocode/regeo?key=7f9503b5a170e3832e08c1a233096cb5&location=${location}&roadlevel=0`;
    let result1 = await req(encodeURI(amapUrl));
    if (!result1.regeocode) {
      console.log("FAILED location", result1, amapUrl);
    }
    await sleep(600);

    output.push({ ...element, location: location, township: result1.regeocode.addressComponent.township });
    console.log("success!!", count++);
  }

  console.log("output", output);
  fs.writeFileSync(outpath, JSON.stringify(output));
}

query();
