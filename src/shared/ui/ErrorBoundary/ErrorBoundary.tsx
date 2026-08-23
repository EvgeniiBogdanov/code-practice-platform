import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../Button";
import styles from "./ErrorBoundary.module.css";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error || new Error("Unknown error"), this.reset);
      }

      return (
        <div className={styles.errorCard} role="alert">
          <h4 className={styles.title}>
            <AlertCircle size={18} />
            <span>Ошибка отображения компонента</span>
          </h4>
          <div className={styles.message}>
            {this.state.error?.message || String(this.state.error)}
          </div>
          <div className={styles.retryButton}>
            <Button variant="primary" size="sm" onClick={this.reset}>
              Попробовать снова
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
