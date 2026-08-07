import React, { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.taskKey !== this.props.taskKey) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-card">
          <div className="error-title">Ошибка выполнения компонента</div>
          <div className="error-message">{this.state.error?.toString()}</div>
          <p className="error-hint">
            Проверьте правильность написания кода в файле задачи.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
