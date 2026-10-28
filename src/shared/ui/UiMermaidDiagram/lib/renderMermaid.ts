import mermaid from "mermaid";

type ThemeVariables = Record<string, string | boolean>;

/** Mermaid derives shades from real colours, so the design tokens are read as computed values. */
const readThemeVariables = (): ThemeVariables => {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const token = (name: string): string => styles.getPropertyValue(name).trim();

  const card = token("--bg-card");
  const panel = token("--bg-sidebar");
  const text = token("--text-main");
  const muted = token("--text-muted");
  const border = token("--border-strong");
  const accent = token("--accent-blue");

  return {
    darkMode: root.getAttribute("data-theme") !== "light",
    fontFamily: token("--font-sans"),
    fontSize: token("--fs-body-sm"),
    background: card,
    textColor: text,
    lineColor: muted,
    // Flowcharts and state diagrams.
    primaryColor: card,
    primaryTextColor: text,
    primaryBorderColor: border,
    secondaryColor: token("--accent-blue-bg"),
    secondaryTextColor: text,
    secondaryBorderColor: token("--accent-blue-border"),
    tertiaryColor: panel,
    tertiaryTextColor: text,
    tertiaryBorderColor: token("--border-color"),
    clusterBkg: panel,
    clusterBorder: token("--border-color"),
    edgeLabelBackground: card,
    // Sequence diagrams.
    actorBkg: card,
    actorBorder: accent,
    actorTextColor: text,
    actorLineColor: muted,
    signalColor: muted,
    signalTextColor: text,
    labelBoxBkgColor: panel,
    labelBoxBorderColor: border,
    labelTextColor: text,
    loopTextColor: text,
    activationBkgColor: token("--accent-blue-bg"),
    activationBorderColor: accent,
    noteBkgColor: token("--accent-yellow-bg"),
    noteBorderColor: token("--accent-yellow-border"),
    noteTextColor: text,
    // Gantt charts: the waterfalls and timings.
    taskBkgColor: token("--accent-blue-bg"),
    taskBorderColor: accent,
    taskTextColor: text,
    taskTextOutsideColor: text,
    taskTextDarkColor: text,
    activeTaskBkgColor: token("--accent-green-bg"),
    activeTaskBorderColor: token("--accent-green"),
    critBkgColor: token("--accent-orange-bg"),
    critBorderColor: token("--accent-orange"),
    doneTaskBkgColor: panel,
    doneTaskBorderColor: border,
    sectionBkgColor: panel,
    altSectionBkgColor: card,
    sectionBkgColor2: panel,
    gridColor: token("--border-color"),
    todayLineColor: token("--accent-orange"),
  };
};

let renderCount = 0;
/** Mermaid keeps one global config: diagrams of a page are drawn one after another, never interleaved. */
let queue: Promise<unknown> = Promise.resolve();

const draw = async (code: string, width: number): Promise<string> => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: readThemeVariables(),
    // Mermaid 12 defaults to ELK, a 340 KB layout engine; dagre ships with Mermaid and is enough here.
    layout: "dagre",
    // A card holds a title and a short detail line without wrapping every word.
    // Tighter gaps keep a five-step chain within the column of an article.
    flowchart: { wrappingWidth: 240, nodeSpacing: 28, rankSpacing: 36, diagramPadding: 8 },
    // Gantt keeps its own small type; the waterfalls of the articles need to be readable at column width.
    gantt: {
      fontSize: 14,
      sectionFontSize: 14,
      barHeight: 26,
      barGap: 8,
      topPadding: 56,
      leftPadding: 180,
      gridLineStartPadding: 40,
      useWidth: width,
    },
  });
  renderCount += 1;
  const { svg } = await mermaid.render(`mermaid-diagram-${renderCount}`, code);
  return svg;
};

/**
 * Draws a diagram in the current theme; throws on a syntax error. `width` is the room the diagram gets:
 * Gantt would otherwise take the width of the window and shrink its text to fit the column.
 */
export const renderMermaid = (code: string, width: number): Promise<string> => {
  const result = queue.then(() => draw(code, width));
  queue = result.catch(() => undefined);
  return result;
};
