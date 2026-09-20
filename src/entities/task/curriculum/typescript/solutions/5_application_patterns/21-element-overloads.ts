interface ImgElement {
  tag: "img";
  src: string;
}

interface AnchorElement {
  tag: "a";
  href: string;
}

interface GenericElement {
  tag: string;
}

function createElement(tag: "img"): ImgElement;
function createElement(tag: "a"): AnchorElement;
function createElement(tag: string): GenericElement;
function createElement(
  tag: string
): ImgElement | AnchorElement | GenericElement {
  if (tag === "img") {
    return { tag, src: "" };
  }
  if (tag === "a") {
    return { tag, href: "" };
  }
  return { tag };
}

const img = createElement("img"); // ImgElement
const link = createElement("a"); // AnchorElement
