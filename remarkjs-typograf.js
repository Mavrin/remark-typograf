const visit = require("unist-util-visit");
const Typograf = require("typograf");
const inlineBlockPlaceholder = `inlineBlockPlaceholder`;
const inlineBlockPlaceHolderLength = inlineBlockPlaceholder.length;

function remarjsTypograf(config = {}) {
  let { typograf, builtIn = true, ...typografConfig } = config;

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

  function visitor(node, index, parent) {
    if (index === 0 && parent.children.length > 1) {
      const typografedText = typograf.execute(
        node.value + inlineBlockPlaceholder
      );
      return (node.value = typografedText.substring(
        0,
        typografedText.length - inlineBlockPlaceHolderLength
      ));
    }
    if (index === parent.children.length - 1 && parent.children.length > 1) {
      const typografedText = typograf.execute(
        inlineBlockPlaceholder + node.value
      );
      return (node.value = typografedText.substring(
        inlineBlockPlaceHolderLength,
        typografedText.length + inlineBlockPlaceHolderLength
      ));
    }
    if (parent.children.length > 1) {
      const typografedText = typograf.execute(
        inlineBlockPlaceholder + node.value + inlineBlockPlaceholder
      );
      return (node.value = typografedText.substring(
        inlineBlockPlaceHolderLength,
        typografedText.length - inlineBlockPlaceHolderLength
      ));
    }
    return (node.value = typograf.execute(node.value));
  }

  function transform(tree) {
    visit(tree, "text", visitor);
  }

  return transform;
}

module.exports = {
  remarjsTypograf,
};
