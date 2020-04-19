const remarkjsTypograf = require("./index");
const Typograf = require("typograf");
const remark = require("remark");

describe("remarkjs typograf", () => {
  it("should throw error if typofraf is not specified", () => {
    expect(() => remarkjsTypograf()).toThrow(/Typograf/);
  });

  it("Should apply", () => {
    expect(
      remark()
        .use(remarkjsTypograf, { typograf: new Typograf({ locale: ["ru"] }) })
        .processSync("## spread operator... end . Some test.\n")
        .toString()
    ).toEqual("## spread operator… end. Some test.\n");
  });

  it("Should handle for code block", () => {
    const result = remark()
      .use(remarkjsTypograf, { typograf: new Typograf({ locale: ["ru"] }) })
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
      .use(remarkjsTypograf, { typograf: new Typograf({ locale: ["ru"] }) })
      .processSync("some... `tick tick...` some... test .")
      .toString();
    expect(result).toEqual("some… `tick tick...` some… test.\n");
  });

  it("Should handle list", () => {
    const result = remark()
      .use(remarkjsTypograf, { typograf: new Typograf({ locale: ["ru"] }) })
      .processSync("# header\n - one point...\n - second point\n")
      .toString();
    expect(result).toEqual("# header\n\n-   one point…\n-   second point\n");
  });

  it("Should handle inline block type", () => {
    const result = remark()
      .use(remarkjsTypograf, { typograf: new Typograf({ locale: ["ru"] }) })
      .processSync(
        "_Italic..._ some... **bold...** . New code [link...](https://github.com) sentence , ~~во внимание~~\n"
      )
      .toString();
    expect(result).toEqual(
      "_Italic…_ some… **bold…**. New code [link…](https://github.com) sentence, ~~во внимание~~\n"
    );
  });
});
