const path = require("path");
const fs = require("fs");
const remark = require("remark");
const unified = require("unified");
const markdown = require("remark-parse");
const Typograf = require("typograf");
const remarkStringify = require("remark-stringify");
const remarkHtml = require("remark-html");
const remarkjsTypograf = require("../index");

const deleteFolderRecursive = function (folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};

const distPath = path.resolve(__dirname, "../dist");
const originalMarkdown = fs.readFileSync(
  path.resolve(__dirname, "./before.md"),
  "utf8"
);

const markdownResultWithTypograf = unified()
  .use(markdown, { commonmark: true })
  .use(remarkjsTypograf, {
    typograf: new Typograf({ locale: ["ru"] }),
    builtIn: false,
  })
  .use(remarkStringify, {
    gfm: true,
    listItemIndent: "1",
    rule: "-",
    ruleSpaces: false,
  })
  .processSync(originalMarkdown).toString();

const htmlResultWithTypograf = remark()
  .use(remarkjsTypograf, {
    typograf: new Typograf({ locale: ["ru"] }),
    builtIn: false,
  })
  .use(remarkHtml)
  .processSync(originalMarkdown);

const htmlResultWithoutTypograf = remark()
  .use(remarkHtml)
  .processSync(originalMarkdown);

deleteFolderRecursive(distPath);
fs.mkdirSync(distPath);
fs.writeFileSync(
  path.resolve(path.join(distPath, "before.md")),
  originalMarkdown,
  "utf8"
);

fs.writeFileSync(
  path.resolve(path.join(distPath, "after.md")),
  markdownResultWithTypograf,
  "utf8"
);

const html = `
<html lang="ru">
<head>
  <title>remark-typograf plugin example</title>
  <meta charset="UTF-8">
  <style>
    body > div.example {
      float: left;
      width: 50%;
    }
  </style>
</head>
  <body>
    <div>
        <a href="https://github.com/Mavrin/remarkjs-typograf">Source code on github</a>
    </div>
    <div class="example">
        <h2>Before (<a target="_blank" href="https://github.com/Mavrin/remarkjs-typograf/blob/gh-pages/after.md">markdown source</a>):</h2>
        <div>${htmlResultWithoutTypograf}</div>
    </div>
    <div class="example">
       <h2>After (<a target="_blank" href="https://github.com/Mavrin/remarkjs-typograf/blob/gh-pages/after.md">markdown source</a>):</h2>
       <div>${htmlResultWithTypograf}</div>
    </div>
  </body>
</html>
`;

fs.writeFileSync(
  path.resolve(path.join(distPath, "index.html")),
  html.trim(),
  "utf8"
);
