import {
  parseJsxTags,
  getTagPairs,
  handleAutoRenameTag,
  checkAutoCloseTag,
  findLastUnclosedTag,
  VOID_HTML_TAGS,
} from "./tagEngine.js";

function runTests() {
  console.log("=== Comprehensive Testing Tag Engine ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log("  PASS:", message);
      passed++;
    } else {
      console.error("  FAIL:", message);
      failed++;
    }
  }

  // 1. Check auto close tag
  console.log("\n1. checkAutoCloseTag tests:");
  assert(checkAutoCloseTag("<div", "")?.tagName === "div", "Auto close <div>");
  assert(checkAutoCloseTag("<div className=\"btn\"", "")?.tagName === "div", "Auto close <div className='btn'>");
  assert(checkAutoCloseTag("<button onClick={() => {}}", "")?.tagName === "button", "Auto close <button with arrow fn>");
  assert(checkAutoCloseTag("<button onClick={() => console.log('> >')}", "")?.tagName === "button", "Auto close <button with arrow fn & strings>");
  assert(checkAutoCloseTag("<div title=\"a > b\"", "")?.tagName === "div", "Auto close with > inside attribute string");
  assert(checkAutoCloseTag("<img src=\"test.jpg\"", "") === null, "Void tag <img> should not auto close");
  assert(checkAutoCloseTag("<input type=\"text\"", "") === null, "Void tag <input> should not auto close");
  assert(checkAutoCloseTag("<br", "") === null, "Void tag <br> should not auto close");
  assert(checkAutoCloseTag("<hr", "") === null, "Void tag <hr> should not auto close");
  assert(checkAutoCloseTag("<div /", "") === null, "Self closing <div /> should not auto close");
  assert(checkAutoCloseTag("<Component /", "") === null, "Self closing <Component /> should not auto close");
  assert(checkAutoCloseTag("<", "")?.isFragment === true, "Fragment <> auto close");
  assert(checkAutoCloseTag("for (let i = 0; i < len", "") === null, "JS for loop < should not auto close");
  assert(checkAutoCloseTag("if (x < y", "") === null, "JS if < should not auto close");
  assert(checkAutoCloseTag("const val = a < b", "") === null, "JS comparison < should not auto close");
  assert(checkAutoCloseTag("<div", "</div>") === null, "Should not duplicate if </div> is right after cursor");
  assert(checkAutoCloseTag("<div", "></div") === null, "Should not duplicate if > is already after cursor");

  // 2. Auto rename tag - Open tag rename
  console.log("\n2. handleAutoRenameTag open tag rename:");
  let res = handleAutoRenameTag("<div></div>", "<span></div>", 5);
  assert(res.updatedCode === "<span></span>", "Rename <div> to <span> updates closing tag");

  res = handleAutoRenameTag("<div></div>", "<div1></div>", 5);
  assert(res.updatedCode === "<div1></div1>", "Rename <div> to <div1> updates closing tag");

  res = handleAutoRenameTag("<div></div>", "<d></div>", 2);
  assert(res.updatedCode === "<d></d>", "Rename <div> to <d> updates closing tag");

  res = handleAutoRenameTag("<Button>Click</Button>", "<Btn>Click</Button>", 4);
  assert(res.updatedCode === "<Btn>Click</Btn>", "Rename <Button> to <Btn>");

  // 3. Auto rename tag - Close tag rename
  console.log("\n3. handleAutoRenameTag close tag rename:");
  res = handleAutoRenameTag("<span></span>", "<span></div>", 12);
  assert(res.updatedCode === "<div></div>", "Rename </span> to </div> updates open tag");

  res = handleAutoRenameTag("<Button>Click</Button>", "<Button>Click</Btn>", 19);
  assert(res.updatedCode === "<Btn>Click</Btn>", "Rename </Button> to </Btn>");

  // 4. Critical: Typing inside tag content / between tags
  console.log("\n4. Critical: Typing inside tag content / between tags:");
  res = handleAutoRenameTag("<div></div>", "<div> </div>", 6);
  assert(res.updatedCode === "<div> </div>", "Typing space between <div> and </div> must NOT corrupt tag!");

  res = handleAutoRenameTag("<div></div>", "<div>\n</div>", 6);
  assert(res.updatedCode === "<div>\n</div>", "Typing newline between tags must NOT corrupt tag!");

  res = handleAutoRenameTag("<div></div>", "<div>hello</div>", 10);
  assert(res.updatedCode === "<div>hello</div>", "Typing text between tags must NOT corrupt tag!");

  res = handleAutoRenameTag("<div className=\"btn\"></div>", "<div className=\"btn\"> </div>", 24);
  assert(res.updatedCode === "<div className=\"btn\"> </div>", "Typing space inside tag with attributes must NOT corrupt tag!");

  res = handleAutoRenameTag("<div><p></p></div>", "<div> <p></p></div>", 6);
  assert(res.updatedCode === "<div> <p></p></div>", "Typing space between outer and inner tag");

  // 5. Typing space & attributes inside open tag
  console.log("\n5. Typing space inside open tag:");
  res = handleAutoRenameTag("<div></div>", "<div ></div>", 5);
  assert(res.updatedCode === "<div ></div>", "Typing space after tag name <div > must NOT corrupt closing tag!");

  res = handleAutoRenameTag("<div ></div>", "<div  ></div>", 6);
  assert(res.updatedCode === "<div  ></div>", "Typing second space inside tag must NOT corrupt closing tag!");

  res = handleAutoRenameTag("<div ></div>", "<div className=\"box\"></div>", 20);
  assert(res.updatedCode === "<div className=\"box\"></div>", "Adding attribute must NOT corrupt closing tag!");

  res = handleAutoRenameTag("<div id=\"test\"></div>", "<div id=\"test-2\"></div>", 17);
  assert(res.updatedCode === "<div id=\"test-2\"></div>", "Editing attribute value must NOT corrupt closing tag!");

  // 6. Fragment handling
  console.log("\n6. Fragment handling:");
  res = handleAutoRenameTag("<></>", "< ></>", 2);
  assert(res.updatedCode === "< ></>", "Typing space in fragment < > must NOT corrupt tag!");

  res = handleAutoRenameTag("<></>", "<div></>", 4);
  assert(res.updatedCode === "<div></div>", "Converting open fragment to <div> updates close fragment to </div>");

  // 7. Multi-line tags
  console.log("\n7. Multi-line tags:");
  const multiLineOld = `<div
  className="container"
>
  Content
</div>`;
  const multiLineNew = `<section
  className="container"
>
  Content
</div>`;
  res = handleAutoRenameTag(multiLineOld, multiLineNew, 8);
  assert(res.updatedCode.includes("</section>"), "Renaming multi-line <div to <section updates </section>");

  // 8. Nested tags
  console.log("\n8. Nested tags:");
  const nestedOld = `<div>
  <span>
    <b>Text</b>
  </span>
</div>`;
  const nestedNew = `<div>
  <strong>
    <b>Text</b>
  </span>
</div>`;
  res = handleAutoRenameTag(nestedOld, nestedNew, 16);
  assert(res.updatedCode.includes("</strong>"), "Renaming <span> to <strong> inside <div> updates </span> to </strong>");

  // 9. findLastUnclosedTag
  console.log("\n9. findLastUnclosedTag tests:");
  assert(findLastUnclosedTag("<div><span>") === "span", "Unclosed span in div");
  assert(findLastUnclosedTag("<div><img><span>") === "span", "Skip void img tag");
  assert(findLastUnclosedTag("<div><span></span>") === "div", "Unclosed div after closed span");
  assert(findLastUnclosedTag("<>") === "", "Unclosed fragment");
  assert(findLastUnclosedTag("<header><nav><ul><li>") === "li", "Deeply nested unclosed tag");

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  return failed === 0;
}

runTests();
