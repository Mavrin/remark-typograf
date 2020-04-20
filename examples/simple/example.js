const fs = require("fs");
const path = require("path");
const remark = require("remark");
const remarkTypograf = require("@mavrin/remark-typograf");
const Typograf = require("typograf");

const processed = remark()
  .use(remarkTypograf, { typograf: new Typograf({ locale: ["en-US"] }) })
  .processSync(fs.readFileSync(path.resolve(__dirname, "example.md")));

fs.writeFileSync(path.resolve(__dirname, "processed-expample.md"), processed);
