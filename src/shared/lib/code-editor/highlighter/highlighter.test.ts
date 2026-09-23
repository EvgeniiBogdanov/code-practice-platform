import { describe, it, expect } from "vitest";
import { highlightCode, highlightCSS, highlightHTML, highlightJS } from "./codeHighlighter";

describe("codeHighlighter - CSS", () => {
  it("highlights CSS class selectors, properties, values, and dimensions", () => {
    const css = `.main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}`;
    const result = highlightCSS(css);
    expect(result).toContain('class="hl-css-selector">.main</span>');
    expect(result).toContain('class="hl-css-prop">display</span>');
    expect(result).toContain('class="hl-css-val">flex</span>');
    expect(result).toContain('class="hl-css-prop">flex-direction</span>');
    expect(result).toContain('class="hl-css-val">column</span>');
    expect(result).toContain('class="hl-num">16</span><span class="hl-css-unit">px</span>');
  });

  it("highlights hex colors with inline color styling and border", () => {
    const css = `.pulsate {
  color: #f59e0b;
  border-color: #ffffff;
}`;
    const result = highlightCSS(css);
    expect(result).toContain('style="border-bottom: 2px solid #f59e0b;"');
    expect(result).toContain("#f59e0b");
    expect(result).toContain('style="border-bottom: 2px solid #ffffff;"');
    expect(result).toContain("#ffffff");
  });

  it("highlights at-rules and keyframes in CSS", () => {
    const css = `@keyframes timer-pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}`;
    const result = highlightCSS(css);
    expect(result).toContain('class="hl-css-atrule">@keyframes</span>');
    expect(result).toContain('class="hl-fn">scale</span>');
  });

  it("highlights CSS comments", () => {
    const css = `/* App.css stylesheet */\n.box { margin: 0; }`;
    const result = highlightCSS(css);
    expect(result).toContain('class="hl-cm">/* App.css stylesheet */</span>');
  });

  it("highlights CSS variables and functions", () => {
    const css = `:root { --bg-color: #191919; }\nbody { background: var(--bg-color); }`;
    const result = highlightCSS(css);
    expect(result).toContain('class="hl-css-prop">--bg-color</span>');
    expect(result).toContain('class="hl-fn">var</span>');
  });
});

describe("codeHighlighter - HTML", () => {
  it("highlights doctype, tags, attributes, and strings", () => {
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <title>Test Page</title>
</head>
<body>
  <div id="root" class="container" data-active="true">
    <h1>Hello World</h1>
    <input type="text" placeholder="Enter name" disabled />
  </div>
</body>
</html>`;
    const result = highlightHTML(html);
    expect(result).toContain('class="hl-doctype">&lt;!DOCTYPE html&gt;</span>');
    expect(result).toContain('class="hl-tag">html</span>');
    expect(result).toContain('class="hl-tag">div</span>');
    expect(result).toContain('class="hl-attr">id</span>');
    expect(result).toContain('class="hl-str">"root"</span>');
    expect(result).toContain('class="hl-attr">class</span>');
    expect(result).toContain('class="hl-str">"container"</span>');
    expect(result).toContain('class="hl-attr">disabled</span>');
  });

  it("highlights HTML comments and entities", () => {
    const html = `<!-- Header section -->\n<p>Tom &amp; Jerry</p>`;
    const result = highlightHTML(html);
    expect(result).toContain('class="hl-cm">&lt;!-- Header section --&gt;</span>');
    expect(result).toContain('class="hl-entity">&amp;amp;</span>');
  });

  it("highlights embedded <style> with CSS highlighter", () => {
    const html = `<style>\n  .btn { color: #38bdf8; }\n</style>`;
    const result = highlightHTML(html);
    expect(result).toContain('class="hl-tag">style</span>');
    expect(result).toContain('class="hl-css-selector">.btn</span>');
    expect(result).toContain('style="border-bottom: 2px solid #38bdf8;"');
  });

  it("highlights embedded <script> with JS highlighter", () => {
    const html = `<script>\n  const message = "Hello";\n  console.log(message);\n</script>`;
    const result = highlightHTML(html);
    expect(result).toContain('class="hl-tag">script</span>');
    expect(result).toContain('class="hl-kw">const</span>');
    expect(result).toContain('class="hl-global">console</span>');
  });
});

describe("codeHighlighter - Unified Dispatcher", () => {
  it("shows multi-selection on property names without selecting their dots", () => {
    const code = "obj.name + other.name";
    const first = code.indexOf("name");
    const second = code.lastIndexOf("name");
    const result = highlightJS(code, {
      multiSelections: [
        { start: first, end: first + 4 },
        { start: second, end: second + 4 },
      ],
    });

    expect(result.match(/class="hl-prop hl-multi-selected">name<\/span>/g)).toHaveLength(2);
    expect(result).not.toContain('class="hl-punct hl-multi-selected">.</span>');
  });

  it("shows selections on JSX tag names and punctuation", () => {
    const code = "<div></div>";
    const result = highlightJS(code, {
      multiSelections: [
        { start: 1, end: 4 },
        { start: 7, end: 10 },
      ],
    });
    expect(result.match(/class="hl-tag hl-multi-selected">div<\/span>/g)).toHaveLength(2);
  });

  it("shows selections in CSS dimension units", () => {
    const code = "gap: 12px;";
    const result = highlightCSS(code, { multiSelections: [{ start: 7, end: 9 }] });
    expect(result).toContain('class="hl-css-unit hl-multi-selected">px</span>');
    expect(result).not.toContain('class="hl-num hl-multi-selected">12</span>');
  });

  it("shows selections in HTML tags and embedded JavaScript at source offsets", () => {
    const code = "<div><script>obj.name</script></div>";
    const result = highlightHTML(code, {
      multiSelections: [
        { start: 1, end: 4 },
        { start: code.indexOf("name"), end: code.indexOf("name") + 4 },
        { start: code.lastIndexOf("div"), end: code.lastIndexOf("div") + 3 },
      ],
    });
    expect(result.match(/class="hl-tag hl-multi-selected">div<\/span>/g)).toHaveLength(2);
    expect(result).toContain('class="hl-prop hl-multi-selected">name</span>');
  });

  it("shows selections in embedded CSS at source offsets", () => {
    const code = "<style>.box { color: red; }</style>";
    const start = code.indexOf("color");
    const result = highlightHTML(code, {
      multiSelections: [{ start, end: start + 5 }],
    });
    expect(result).toContain('class="hl-css-prop hl-multi-selected">color</span>');
  });

  it("shows selections in plain text files", () => {
    const code = "name name";
    expect(
      highlightCode(code, "text", {
        multiSelections: [
          { start: 0, end: 4 },
          { start: 5, end: 9 },
        ],
      })
    ).toBe(
      '<span class="hl-multi-selected">name</span> <span class="hl-multi-selected">name</span>'
    );
  });

  it("routes .css files to CSS highlighter", () => {
    const css = `.timer { font-size: 24px; }`;
    const result = highlightCode(css, "App.css");
    expect(result).toContain('class="hl-css-selector">.timer</span>');
    expect(result).toContain('class="hl-css-prop">font-size</span>');
  });

  it("routes .html files to HTML highlighter", () => {
    const html = `<div class="card">Content</div>`;
    const result = highlightCode(html, "index.html");
    expect(result).toContain('class="hl-tag">div</span>');
    expect(result).toContain('class="hl-attr">class</span>');
  });

  it("routes .jsx / .js files to JS highlighter", () => {
    const js = `import React from "react";\nexport const App = () => <div>Hello</div>;`;
    const result = highlightCode(js, "App.jsx");
    expect(result).toContain('class="hl-kw">import</span>');
    expect(result).toContain('class="hl-kw">export</span>');
  });
});
