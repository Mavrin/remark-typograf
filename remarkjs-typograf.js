const visit = require("unist-util-visit");

const inlineBlockPlaceholder = `inlineBlockPlaceholder`;
const inlineBlockPlaceHolderLength = inlineBlockPlaceholder.length;

function remarjsTypograf({ typograf } = {}) {
  if (!typograf) {
    throw new Error(
      "Typograf option should be specified.Please pass instance typograf as option."
    );
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
