import { ITheme } from "@xterm/xterm";

export function getTerminalTheme(themeName: "light" | "dark"): ITheme {
  const isLight = themeName === "light";
  return isLight
    ? {
        background: "#ffffff",
        foreground: "#37352f",
        cursor: "#0066cc",
        selectionBackground: "rgba(0, 102, 204, 0.18)",
        black: "#37352f",
        red: "#d32f2f",
        green: "#2d6a4f",
        yellow: "#c75d18",
        blue: "#0066cc",
        magenta: "#7d449e",
        cyan: "#0066cc",
        white: "#787774",
        brightBlack: "#787774",
        brightRed: "#ef4444",
        brightGreen: "#10b981",
        brightYellow: "#b8860b",
        brightBlue: "#0284c7",
        brightMagenta: "#7d449e",
        brightCyan: "#0284c7",
        brightWhite: "#37352f",
      }
    : {
        background: "#141414",
        foreground: "#cccccc",
        cursor: "#38bdf8",
        selectionBackground: "rgba(56, 189, 248, 0.3)",
        black: "#1e1e1e",
        red: "#f87171",
        green: "#34d399",
        yellow: "#fbbf24",
        blue: "#60a5fa",
        magenta: "#c084fc",
        cyan: "#38bdf8",
        white: "#f8fafc",
        brightBlack: "#64748b",
        brightRed: "#fca5a5",
        brightGreen: "#6ee7b7",
        brightYellow: "#fde047",
        brightBlue: "#93c5fd",
        brightMagenta: "#d8b4fe",
        brightCyan: "#67e8f9",
        brightWhite: "#ffffff",
      };
}
