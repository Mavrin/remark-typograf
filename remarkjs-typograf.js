const visit = require("unist-util-visit");

function remarjsTypograf({ typograf } = {}) {
  if (!typograf) {
    throw new Error(
      "Typograf option should be specified.Please pass instance typograf as option."
    );
  }
  function visitor(node, index, parent) {
    if (parent.children.length - 1 === index) {
      return (node.value = typograf.execute(node.value));
    }
    if (parent.children[index + 1].type === "inlineCode") {
      return (node.value = `${typograf.execute(node.value)} `);
    }
  }

  function transform(tree) {
    visit(tree, "text", visitor);
  }

  return transform;
}

module.exports = {
  remarjsTypograf,
};
