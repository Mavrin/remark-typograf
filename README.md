# remarkjs-typograf

plugin to make your typography better with https://github.com/typograf

Example https://mavrin.github.io/remarkjs-typograf/

## Install

[npm][]:

```sh
npm install @mavrin/remarkjs-typograf typograf remark
```

## Use

Say we have the following file, `example.md`:

````markdown
## spread operator `...`

It is test...

```js
function test(...args) {
  return args;
}
```
````

````

And our script, `example.js`, looks as follows:

```js

const fs = require("fs");
const path = require("path");
const remark = require("remark");
const remarkTypograf = require("@mavrin/remarkjs-typograf");
const Typograf = require("typograf");

const processed = remark()
  .use(remarkTypograf, { typograf: new Typograf({ locale: ["en-US"] }) })
  .processSync(fs.readFileSync(path.resolve(__dirname, "example.md")));

fs.writeFileSync(path.resolve(__dirname, "processed-expample.md"), processed);

````

Yields:

````markdown
## spread operator `...`

It is test…

```js
function test(...args) {
  return args;
}
```
````

[Example source code](/examples/simple)
