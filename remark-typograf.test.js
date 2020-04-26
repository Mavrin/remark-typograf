const remarkTypograf = require("./index");
const Typograf = require("typograf");
const remark = require("remark");

describe("remarkjs typograf", () => {
  it("should throw error if typofraf is not specified", () => {
    expect(() => remarkTypograf({ builtIn: false })).toThrow(/Typograf/);
  });

  it("should throw error if typofraf is specified and builtIn true", () => {
    expect(() =>
      remarkTypograf({
        typograf: new Typograf({ locale: ["en-US"] }),
        builtIn: true,
      })
    ).toThrow(/`builtIn` option is true and `typograf` also is passed/);
  });

  it("should throw error if locale is not array", () => {
    expect(() => remarkTypograf({ locale: "en" })).toThrow(
      /Locale config should be array of string/
    );
  });

  it("Should work with explicit typograf", () => {
    expect(
      remark()
        .use(remarkTypograf, {
          typograf: new Typograf({ locale: ["en-US"] }),
          builtIn: false,
        })
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should apply with default config", () => {
    expect(
      remark()
        .use(remarkTypograf)
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should apply", () => {
    expect(
      remark()
        .use(remarkTypograf, { locale: ["en-US"] })
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("should apply keywords config", () => {
    const result = remark()
      .use(remarkTypograf, {
        keywords: [":(", "TL;DR"],
      })
      .processSync(`## 1. Это сложно :(.\nSome test. :( "TL;DR" operator... :(`)
      .toString();
    expect(result).toEqual(
      "## 1. Это сложно :(.\n\nSome test. :( «TL;DR» operator… :(\n"
    );
  });

  it("Should apply default locale", () => {
    expect(
      remark()
        .use(remarkTypograf, {})
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should handle for code block", () => {
    const result = remark()
      .use(remarkTypograf, { locale: ["ru"] })
      .processSync(
        "value - some code...\n```js\nconst value = [...[1,3]];\n```"
      )
      .toString();
    expect(result).toEqual(
      "value — some code…\n\n```js\nconst value = [...[1,3]];\n```\n"
    );
  });

  it("Should handle for backtick", () => {
    const result = remark()
      .use(remarkTypograf, { locale: ["ru"] })
      .processSync("some... `tick tick...` some... test .")
      .toString();
    expect(result).toEqual("some… `tick tick...` some… test.\n");
  });

  it("Should handle list", () => {
    const result = remark()
      .use(remarkTypograf, { locale: ["ru"] })
      .processSync("# header\n - one point...\n - second point\n")
      .toString();
    expect(result).toEqual("# header\n\n-   one point…\n-   second point\n");
  });

  it("Should handle inline block type", () => {
    const result = remark()
      .use(remarkTypograf, { locale: ["ru"] })
      .processSync(
        "_Italic..._ some... **bold...** . New code [link...](https://github.com) sentence , ~~во внимание~~\n"
      )
      .toString();
    expect(result).toEqual(
      "_Italic…_ some… **bold…**. New code [link…](https://github.com) sentence, ~~во внимание~~\n"
    );
  });
});
