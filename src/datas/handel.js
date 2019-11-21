var request = require("request");
var fs = require("fs");

let inpath = "src/datas/partyDatasSH.json";
let outpath = "src/datas/partyDatasSH.json";

let out = [];
let array = JSON.parse(fs.readFileSync(inpath, "utf8"));

for (let i = 0; i < array.length; i++) {
  let element = array[i];
  if (element.name && element.addr && element.phone) {
    out.push(element);
  }
}
fs.writeFileSync(outpath, JSON.stringify(array));
