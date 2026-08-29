/**
 * Sandboxed React Preview iframe HTML Generator
 */

import { transpileCode } from "./transpiler";

export interface SandboxIframeOptions {
  filesMap?: Record<string, { name: string; code: string }>;
  entryFileName?: string;
  theme?: "light" | "dark";
}

export function buildSandboxIframeSrcDoc({
  filesMap = {},
  entryFileName = "",
  theme = "dark",
}: SandboxIframeOptions): { srcDoc: string | null; error: Error | null } {
  const fileKeys = Object.keys(filesMap);
  if (fileKeys.length === 0) {
    return { srcDoc: null, error: null };
  }

  const entryKey =
    fileKeys.find((k) => /^(index|app|main)\.(jsx|tsx)$/i.test(k)) ||
    fileKeys.find((k) => /^(index|app|main)\.(js|ts)$/i.test(k)) ||
    (entryFileName && filesMap[entryFileName] ? entryFileName : null) ||
    fileKeys.find((k) => /\.(jsx|tsx)$/i.test(k)) ||
    fileKeys[0];

  const transpiledModules: Record<string, string> = {};
  let customCss = "";
  for (const key of fileKeys) {
    const fileObj = filesMap[key];
    if (key.endsWith(".css") || key.endsWith(".scss") || key.endsWith(".less")) {
      customCss += `\n/* ${key} */\n` + (fileObj.code || "");
      continue;
    }
    const { code: transformedCode, error: transpileErr } = transpileCode(fileObj.code, key);
    if (transpileErr) {
      return { srcDoc: null, error: transpileErr };
    }
    transpiledModules[key] = transformedCode || "";
  }

  const isLight = theme === "light";
  const bgColor = isLight ? "#ffffff" : "#141414", textColor = isLight ? "#1e293b" : "#cccccc";
  const borderColor = isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight ? "#f8fafc" : "#1e1e1e", inputBorder = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.12)";
  const btnBg = isLight ? "#f3f4f6" : "#222222", btnText = isLight ? "#1f2937" : "#e5e5e5";
  const btnBorder = isLight ? "#d1d5db" : "rgba(255, 255, 255, 0.1)", btnHoverBg = isLight ? "#e5e7eb" : "#2d2d2d";
  const errorBg = isLight ? "rgba(239, 68, 68, 0.08)" : "rgba(239, 68, 68, 0.12)";
  const errorBorder = isLight ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.4)", errorText = isLight ? "#991b1b" : "#fca5a5";

  const srcDoc = `<!DOCTYPE html>
<html lang="ru" data-theme="${isLight ? "light" : "dark"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      color-scheme: ${isLight ? "light" : "dark"};
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --bg: ${bgColor};
      --text: ${textColor};
      --border: ${borderColor};
      --accent: #3b82f6;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0;
      background: var(--bg); color: var(--text);
      font-family: var(--font-sans); font-size: 14px; line-height: 1.5;
      -webkit-font-smoothing: antialiased; overflow: hidden; border: none; outline: none;
    }
    body {
      padding: 24px; min-height: auto; height: auto;
      display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start;
      gap: 12px; width: 100%; border: none; outline: none;
    }
    #root {
      width: 100%; display: flex; flex-direction: column; align-items: flex-start;
      justify-content: flex-start; gap: 12px; min-height: auto; border: none; outline: none;
    }
    input, select, textarea, button {
      font-family: inherit; font-size: 13.5px; line-height: 1.3; box-sizing: border-box;
    }
    input:not([type="checkbox"]):not([type="radio"]):not([type="color"]):not([type="range"]):not([type="file"]),
    input:not([type]), input[type="text"], input[type="search"], input[type="password"],
    input[type="email"], input[type="number"], input[type="date"], input[type="time"],
    input[type="datetime-local"], input[type="month"], input[type="week"], input[type="tel"],
    input[type="url"], textarea {
      display: inline-block; vertical-align: middle; box-sizing: border-box; width: auto;
      max-width: 100%; padding: 6px 10px; height: 34px; line-height: 1.3;
      color-scheme: ${isLight ? "light" : "dark"};
      background-color: ${inputBg}; border: 1px solid ${inputBorder};
      border-radius: 6px; color: var(--text); font-family: var(--font-sans);
      font-size: 13.5px; outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    input::placeholder, textarea::placeholder {
      color: ${isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.45)"}; opacity: 1;
    }
    input:not([type="checkbox"]):not([type="radio"]):hover, textarea:hover {
      border-color: ${isLight ? "#94a3b8" : "rgba(255, 255, 255, 0.28)"};
      background-color: ${isLight ? "#f1f5f9" : "#242424"};
    }
    input:not([type="checkbox"]):not([type="radio"]):focus, textarea:focus {
      border-color: var(--accent); background-color: ${isLight ? "#ffffff" : "#262626"};
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    }
    textarea { resize: vertical; min-height: 72px; height: auto; line-height: 1.45; }
    select {
      display: inline-block; vertical-align: middle; box-sizing: border-box; width: auto;
      min-width: 140px; height: 34px; line-height: 1.3; padding: 6px 30px 6px 10px;
      color-scheme: ${isLight ? "light" : "dark"};
      background-color: ${inputBg}; border: 1px solid ${inputBorder}; border-radius: 6px;
      color: var(--text); font-family: var(--font-sans); font-size: 13.5px; cursor: pointer; outline: none;
      -webkit-appearance: none; -moz-appearance: none; appearance: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }
    button, input[type="button"], input[type="submit"], input[type="reset"] {
      display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;
      gap: 6px; padding: 6px 14px; height: 34px; border-radius: 6px;
      border: 1px solid ${btnBorder}; background: ${btnBg}; color: ${btnText};
      font-family: var(--font-sans); font-size: 13px; font-weight: 500; line-height: 1.3;
      cursor: pointer; user-select: none; outline: none;
      transition: opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
    }
    button:hover, input[type="button"]:hover {
      background: ${btnHoverBg}; border-color: ${isLight ? "#9ca3af" : "rgba(255, 255, 255, 0.25)"};
    }
    .sandbox-error-card {
      margin: 12px 0; padding: 16px; border-radius: 8px;
      background: ${errorBg}; border: 1px solid ${errorBorder}; color: var(--text);
    }
    .sandbox-error-title {
      font-weight: 600; font-size: 14px; color: #ef4444; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;
    }
    .sandbox-error-msg {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12.5px; white-space: pre-wrap; word-break: break-word;
      background: rgba(0, 0, 0, 0.06); padding: 8px 12px; border-radius: 6px; color: ${errorText}; line-height: 1.45;
    }
    .sandbox-error-hint { margin-top: 10px; font-size: 12px; color: ${isLight ? "#64748b" : "#94a3b8"}; }
    .sandbox-retry-btn {
      margin-top: 12px; background: #3b82f6; color: #ffffff; padding: 6px 12px;
      font-size: 12px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500;
    }
    ${customCss}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    (function() {
      function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      function renderError(err) {
        var root = document.getElementById('root');
        if (!root) return;
        var msg = err && err.message ? err.message : String(err);
        root.innerHTML = '<div class="sandbox-error-card">' +
          '<div class="sandbox-error-title"><span>Ошибка выполнения React компонента</span></div>' +
          '<div class="sandbox-error-msg">' + escapeHtml(msg) + '</div>' +
          '<div class="sandbox-error-hint">Или исправьте логику во вкладке «Код».</div>' +
          '<button class="sandbox-retry-btn" onclick="window.location.reload()"><span>Попробовать снова</span></button>' +
        '</div>';
      }
      window.onerror = function(msg, src, lineno, colno, error) { renderError(error || msg); return true; };
      window.onunhandledrejection = function(e) { renderError(e.reason || 'Unhandled Promise Rejection'); };

      try {
        var runtime = window.parent && window.parent.__SANDBOX_RUNTIME__;
        if (!runtime) throw new Error("Песочница не смогла инициализировать рантайм React");

        var React = runtime.React;
        var ReactHooks = runtime.ReactHooks;
        var ReactDOM = runtime.ReactDOM;
        var ReactDOMClient = runtime.ReactDOMClient || runtime.ReactDOM;
        var ReactJsxRuntime = runtime.ReactJsxRuntime;
        var ReactJsxDevRuntime = runtime.ReactJsxDevRuntime;
        var LucideIcons = runtime.LucideIcons;
        var ReactRedux = runtime.ReactRedux;
        var ReduxToolkit = runtime.ReduxToolkit;
        var ZustandModule = runtime.ZustandModule;
        var ZustandMiddleware = runtime.ZustandMiddleware;

        var IframeErrorBoundary = (function(_super) {
          function IframeErrorBoundary(props) {
            var _this = _super.call(this, props) || this;
            _this.state = { hasError: false, error: null };
            return _this;
          }
          IframeErrorBoundary.prototype = Object.create(_super.prototype);
          IframeErrorBoundary.prototype.constructor = IframeErrorBoundary;
          IframeErrorBoundary.getDerivedStateFromError = function(error) { return { hasError: true, error: error }; };
          IframeErrorBoundary.prototype.componentDidCatch = function() {};
          IframeErrorBoundary.prototype.render = function() {
            var _this = this;
            if (this.state.hasError) {
              var msg = (this.state.error && this.state.error.message) ? this.state.error.message : String(this.state.error);
              return React.createElement('div', { className: 'sandbox-error-card' },
                React.createElement('div', { className: 'sandbox-error-title' },
                  React.createElement('span', null, 'Ошибка выполнения React компонента')
                ),
                React.createElement('div', { className: 'sandbox-error-msg' }, msg),
                React.createElement('div', { className: 'sandbox-error-hint' }, 'Или исправьте логику во вкладке «Код».'),
                React.createElement('button', {
                  className: 'sandbox-retry-btn',
                  onClick: function() { _this.setState({ hasError: false, error: null }); }
                }, 'Попробовать снова')
              );
            }
            return this.props.children;
          };
          return IframeErrorBoundary;
        })(React.Component);

        var modulesCode = ${JSON.stringify(transpiledModules).replace(/<\/script/gi, "<\\/script")};
        var fileKeys = Object.keys(modulesCode);
        var moduleCache = new Map();

        function requireModule(modulePath) {
          if (modulePath === 'react') return Object.assign({}, React, ReactHooks, { default: React });
          if (modulePath === 'react/jsx-runtime') return Object.assign({}, ReactJsxRuntime, { default: ReactJsxRuntime });
          if (modulePath === 'react/jsx-dev-runtime') return Object.assign({}, ReactJsxDevRuntime, { default: ReactJsxDevRuntime });
          if (modulePath === 'react-dom/client') return Object.assign({}, ReactDOMClient, { default: ReactDOMClient });
          if (modulePath === 'react-dom') return Object.assign({}, ReactDOM, { default: ReactDOM });
          if (modulePath === 'lucide-react') return Object.assign({}, LucideIcons, { default: LucideIcons });
          if (modulePath === 'react-redux') return Object.assign({}, ReactRedux, { default: ReactRedux });
          if (modulePath === '@reduxjs/toolkit') return Object.assign({}, ReduxToolkit, { default: ReduxToolkit });
          if (modulePath === 'zustand') return ZustandModule;
          if (modulePath === 'zustand/middleware') return Object.assign({}, ZustandMiddleware, { default: ZustandMiddleware });
          if (modulePath.endsWith('.css') || modulePath.endsWith('.scss') || modulePath.endsWith('.less')) return {};

          var cleanPath = modulePath.replace(/^(\\.\\/|\\.\\.\\/)+/, '');
          var cleanPathWithoutExt = cleanPath.replace(/\\.[^.]+$/, '');
          var matchedKey = fileKeys.find(function(k) {
            var kBase = k.replace(/\\.[^.]+$/, '');
            return k === cleanPath || kBase === cleanPath || kBase === cleanPathWithoutExt || k.endsWith('/' + cleanPath) || k.endsWith('/' + cleanPathWithoutExt);
          });

          if (!matchedKey) {
            if (LucideIcons[modulePath]) return LucideIcons[modulePath];
            throw new Error('Модуль не найден: "' + modulePath + '"');
          }

          if (moduleCache.has(matchedKey)) return moduleCache.get(matchedKey).exports;

          var code = modulesCode[matchedKey];
          var exports = {};
          var module = { exports: exports };
          moduleCache.set(matchedKey, module);

          if (!code || !code.trim()) return module.exports;

          var fn = new Function(
            'require', 'exports', 'module',
            code + ';\\n' +
            'if (module.exports && module.exports.default) return module.exports.default;\\n' +
            'if (exports && exports.default) return exports.default;\\n' +
            'if (module.exports && typeof module.exports === "function") return module.exports;\\n' +
            'var namedExp = Object.values(module.exports || exports).find(function(v) { return typeof v === "function"; });\\n' +
            'if (namedExp) return namedExp;\\n' +
            'if (typeof App !== "undefined" && typeof App === "function") return App;\\n' +
            'if (typeof Solution !== "undefined" && typeof Solution === "function") return Solution;\\n' +
            'if (typeof Component !== "undefined" && typeof Component === "function") return Component;\\n' +
            'if (typeof TaskComponent !== "undefined" && typeof TaskComponent === "function") return TaskComponent;\\n' +
            'return null;'
          );

          var evaluated = fn(requireModule, exports, module);
          if (evaluated && !module.exports.default) module.exports.default = evaluated;
          return module.exports;
        }

        var entryKey = ${JSON.stringify(entryKey)};
        var entryModule = requireModule('./' + entryKey);
        var LiveComponent = (entryModule && entryModule.default) || (typeof entryModule === 'function' ? entryModule : null) || Object.values(entryModule || {}).find(function(v) { return typeof v === 'function'; });
        if (!LiveComponent) {
          document.getElementById('root').innerHTML = '<div class="sandbox-empty-prompt">Экспортируйте React компонент по умолчанию (<code>export default function App() { ... }</code>), чтобы увидеть результат.</div>';
          return;
        }

        var createRootFn = (ReactDOMClient && ReactDOMClient.createRoot) || (ReactDOM && ReactDOM.createRoot);
        var root = createRootFn(document.getElementById('root'));
        root.render(
          React.createElement(IframeErrorBoundary, null,
            React.createElement(LiveComponent)
          )
        );

        function notifyHeight() {
          try {
            var rootEl = document.getElementById('root');
            var contentHeight = rootEl ? Math.max(rootEl.getBoundingClientRect().height || 0, rootEl.scrollHeight || 0, rootEl.offsetHeight || 0) : 0;
            var finalHeight = contentHeight > 0 ? Math.max(260, Math.ceil(contentHeight + 48)) : 260;
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'SANDBOX_RESIZE', height: finalHeight }, '*');
            }
          } catch (e) {}
        }

        if (typeof ResizeObserver !== 'undefined') {
          var ro = new ResizeObserver(notifyHeight);
          var rootEl = document.getElementById('root');
          if (rootEl) ro.observe(rootEl);
          if (document.body) ro.observe(document.body);
        }
        window.addEventListener('resize', notifyHeight);
        window.addEventListener('load', notifyHeight);
        requestAnimationFrame(notifyHeight);
      } catch (err) {
        renderError(err);
      }
    })();
  </script>
</body>
</html>`;

  return { srcDoc, error: null };
}
