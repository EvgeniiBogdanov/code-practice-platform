import React, { Component } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("[ErrorBoundary] Caught runtime exception:", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.taskKey !== this.props.taskKey ||
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === "function") {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-card" style={{ margin: "24px auto", maxWidth: "680px", width: "100%" }}>
          <div className="error-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} style={{ color: "var(--color-error, #ef4444)" }} />
            <span>Ошибка отображения интерфейса</span>
          </div>
          <div
            className="error-message"
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "13px",
              marginTop: "8px",
            }}
          >
            {this.state.error?.message || this.state.error?.toString()}
          </div>
          <p className="error-hint" style={{ marginTop: "12px", fontSize: "12.5px" }}>
            Произошла непредвиденная ошибка в компоненте. Вы можете попробовать перезагрузить представление или вернуться на главную страницу.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="action-btn blue"
              style={{ padding: "6px 14px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              onClick={this.handleRetry}
            >
              <RotateCcw size={14} />
              <span>Попробовать снова</span>
            </button>
            <Link
              to="/home"
              className="action-btn"
              style={{
                padding: "6px 14px",
                fontSize: "13px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "transparent",
                border: "1px solid var(--border-color)",
                color: "var(--text-main)",
                textDecoration: "none",
                borderRadius: "6px",
              }}
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              <Home size={14} />
              <span>На главную</span>
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
