# remarkjs-typograf

Plugin for [remark](https://github.com/remarkjs/remark) to make your typography better with [typograf](https://github.com/typograf/typograf)

Example https://mavrin.github.io/remark-typograf/

## Install

[npm](https://docs.npmjs.com/cli/install):

```sh
npm install @mavrin/remark-typograf remark
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

You probably want to use it on the CLI through a config file:

```diff
  …
  "remarkConfig": {
    "plugins": [
      [
        "@mavrin/remark-typograf",
        {
          "locale": ["ru"]
        }
      ]
    ]
  }
…
```

Or use it on the CLI directly (ru locale will be used as default)

```sh
remark -u @mavrin/remark-typograf example.md -o processed-example.md
```

Or use this on the API:

```js
const fs = require("fs");
const path = require("path");
const remark = require("remark");
const remarkTypograf = require("@mavrin/remark-typograf");

const processed = remark()
  .use(remarkTypograf, { locale: ["en-US"], keywords: [":)"] })
  .processSync(fs.readFileSync(path.resolve(__dirname, "example.md")));

fs.writeFileSync(path.resolve(__dirname, "processed-example.md"), processed);
```

or with custom typograf:

```js
const fs = require("fs");
const path = require("path");
const remark = require("remark");
const remarkTypograf = require("@mavrin/remark-typograf");
const Typograf = require("typograf");

const processed = remark()
  .use(remarkTypograf, {
    typograf: new Typograf({ locale: ["en-US"] }),
    keywords: [":)"],
    builtIn: false,
  })
  .processSync(fs.readFileSync(path.resolve(__dirname, "example.md")));

fs.writeFileSync(path.resolve(__dirname, "processed-example.md"), processed);
```

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
