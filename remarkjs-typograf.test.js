const remarkjsTypograf = require("./index");
const Typograf = require("typograf");
const remark = require("remark");

describe("remarkjs typograf", () => {
  it("should throw error if typofraf is not specified", () => {
    expect(() => remarkjsTypograf({ builtIn: false })).toThrow(/Typograf/);
  });

  it("should throw error if typofraf is specified and builtIn true", () => {
    expect(() =>
      remarkjsTypograf({
        typograf: new Typograf({ locale: ["en-US"] }),
        builtIn: true,
      })
    ).toThrow(/`builtIn` option is true and `typograf` also is passed/);
  });

  it("should throw error if locale is not array", () => {
    expect(() => remarkjsTypograf({ locale: "en" })).toThrow(
      /Locale config should be array of string/
    );
  });

  it("Should work with explicit typograf", () => {
    expect(
      remark()
        .use(remarkjsTypograf, {
          typograf: new Typograf({ locale: ["en-US"] }),
          builtIn: false,
        })
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should apply", () => {
    expect(
      remark()
        .use(remarkjsTypograf, { locale: ["en-US"] })
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should apply default locale", () => {
    expect(
      remark()
        .use(remarkjsTypograf, {})
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should handle for code block", () => {
    const result = remark()
      .use(remarkjsTypograf, { locale: ["ru"] })
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
      .use(remarkjsTypograf, { locale: ["ru"] })
      .processSync("some... `tick tick...` some... test .")
      .toString();
    expect(result).toEqual("some… `tick tick...` some… test.\n");
  });

  it("Should handle list", () => {
    const result = remark()
      .use(remarkjsTypograf, { locale: ["ru"] })
      .processSync("# header\n - one point...\n - second point\n")
      .toString();
    expect(result).toEqual("# header\n\n-   one point…\n-   second point\n");
  });

  it("Should handle inline block type", () => {
    const result = remark()
      .use(remarkjsTypograf, { locale: ["ru"] })
      .processSync(
        "_Italic..._ some... **bold...** . New code [link...](https://github.com) sentence , ~~во внимание~~\n"
      )
      .toString();
    expect(result).toEqual(
      "_Italic…_ some… **bold…**. New code [link…](https://github.com) sentence, ~~во внимание~~\n"
    );
  });
});
