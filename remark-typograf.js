const visit = require("unist-util-visit");
const Typograf = require("typograf");
const escapeRegexp = require("lodash.escaperegexp");

function remarkTypograf(config = {}) {
  let { typograf, builtIn = true, keywords = [], ...typografConfig } = config;

  if (!typograf && builtIn === false) {
    throw new Error(
      "Typograf option should be specified. Please pass instance typograf as option or set builtIn to true"
    );
  }

  if (typograf && builtIn === true) {
    throw new Error(
      "`builtIn` option is true and `typograf` also is passed. Please set `builtIn` to false or clean `typograf` option"
    );
  }

  if (
    builtIn === true &&
    typografConfig.locale &&
    !Array.isArray(typografConfig.locale)
  ) {
    throw new Error(
      `Locale config should be array of string. e.g. {"locale": ["ru"]}`
    );
  }

  if (
    builtIn === true &&
    !Array.isArray(typografConfig && typografConfig.locale)
  ) {
    typografConfig.locale = ["ru"];
  }

  if (!typograf) {
    typograf = new Typograf(typografConfig);
  }

  function getTextNodes(tree) {
    const textNodes = [];
    if (tree.type === "inlineCode") {
      textNodes.push("`" + tree.value + "`");
      return textNodes;
    }
    if (typeof tree.value === "string") {
      textNodes.push(tree.value);
      return textNodes;
    }
    visit(tree, "inlineCode", (node) => {
      textNodes.push("`" + node.value + "`");
    });
    visit(tree, "text", (node) => {
      textNodes.push(node.value);
    });
    return textNodes;
  }

  function getLeftSiblingText(index, children) {
    const textNodes = getTextNodes(children[index - 1]);
    return typograf.execute(textNodes.pop() || "");
  }

  function getRightSiblingText(index, children) {
    const textNodes = getTextNodes(children[index + 1]);
    return typograf.execute(textNodes.shift() || "");
  }

  function applyTypograf(text, index, parent) {
    if (index === 0 && parent.children.length > 1) {
      const rightText = getRightSiblingText(index, parent.children);
      const typografedText = typograf.execute(text + rightText);
      return typografedText.substring(
        0,
        typografedText.length - rightText.length
      );
    }
    if (index === parent.children.length - 1 && parent.children.length > 1) {
      const leftText = getLeftSiblingText(index, parent.children);
      const typografedText = typograf.execute(leftText + text);
      return typografedText.substring(
        leftText.length,
        typografedText.length + leftText.length
      );
    }
    if (parent.children.length > 1) {
      const leftText = getLeftSiblingText(index, parent.children);
      const rightText = getRightSiblingText(index, parent.children);
      const typografedText = typograf.execute(leftText + text + rightText);
      return typografedText.substring(
        leftText.length,
        typografedText.length - rightText.length
      );
    }
    return typograf.execute(text);
  }

  function visitor(node, index, parent) {
    let text = node.value;

    keywords.forEach((keyword) => {
      const hex = Buffer.from(keyword).toString("hex");
      const regExp = new RegExp(`${escapeRegexp(keyword)}`, `g`);
      text = text.replace(regExp, hex);
    });

    text = applyTypograf(text, index, parent);

    keywords.forEach((keyword) => {
      const hex = Buffer.from(keyword).toString("hex");
      const regExp = new RegExp(`${escapeRegexp(hex)}`, `g`);
      text = text.replace(regExp, keyword);
    });

    node.value = text;
  }

  function transform(tree) {
    visit(tree, "text", visitor);
  }

  return transform;
}

module.exports = {
  remarkTypograf,
};
