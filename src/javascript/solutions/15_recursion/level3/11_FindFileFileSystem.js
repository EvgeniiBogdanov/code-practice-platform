const fs = {
  name: "root",
  type: "folder",
  children: [
    { name: "index.js", type: "file" },
    {
      name: "src",
      type: "folder",
      children: [
        { name: "app.js", type: "file" },
        { name: "utils.js", type: "file" },
      ],
    },
  ],
};

const findFile = (node, name) => {
  if (!node) return false;
  if (node.name === name) return true;
  if (node.type === "folder" && Array.isArray(node.children)) {
    return node.children.some((child) => findFile(child, name));
  }
  return false;
};

console.log(findFile(fs, "utils.js")); // true
