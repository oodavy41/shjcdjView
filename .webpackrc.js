const path = require("path");

export default {
  entry: "src/index.js",

  extraBabelPlugins: [],
  // env: {
  //   development: {
  //     extraBabelPlugins: ["dva-hmr"]
  //   }
  // },
  alias: {},
  ignoreMomentLocale: true,
  env: {
    development: {
      publicPath: "/",
      define: {
        "process.env.NODE_ENV": "development"
      }
    },
    production: {
      publicPath: "./",
      define: {
        "process.env.NODE_ENV": "production"
      }
    }
  },
  // html: { template: "./src/index.ejs" },
  // html: {
  //   filename: "ctrl",
  //   template: "./src/ctrl.ejs"
  // },
  disableCSSModules: false,
  disableDynamicImport: false,
  hash: false
};
