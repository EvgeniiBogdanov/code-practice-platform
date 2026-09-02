import { ITheme } from "@xterm/xterm";

export function getTerminalTheme(themeName: "light" | "dark"): ITheme {
  const isLight = themeName === "light";
  return isLight
    ? {
        background: "#ffffff",
        foreground: "#37352f",
        cursor: "#0860c4",
        selectionBackground: "rgba(8, 96, 196, 0.16)",
        black: "#37352f",
        red: "#b91c1c",
        green: "#136c2e",
        yellow: "#794a00",
        blue: "#0860c4",
        magenta: "#6e3fc7",
        cyan: "#046274",
        white: "#57606a",
        brightBlack: "#6f6e69",
        brightRed: "#cf222e",
        brightGreen: "#116329",
        brightYellow: "#953800",
        brightBlue: "#0550ae",
        brightMagenta: "#8250df",
        brightCyan: "#057a8e",
        brightWhite: "#24292f",
      }
    : {
        background: "#141414",
        foreground: "#f1f5f9",
        cursor: "#58a6ff",
        selectionBackground: "rgba(88, 166, 255, 0.28)",
        black: "#1e1e1e",
        red: "#ff7b72",
        green: "#4ade80",
        yellow: "#facc15",
        blue: "#58a6ff",
        magenta: "#c084fc",
        cyan: "#38bdf8",
        white: "#f8fafc",
        brightBlack: "#8b949e",
        brightRed: "#ffa198",
        brightGreen: "#86efac",
        brightYellow: "#fde047",
        brightBlue: "#79c0ff",
        brightMagenta: "#d8b4fe",
        brightCyan: "#67e8f9",
        brightWhite: "#ffffff",
      };
}
