import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Code2, Home, Zap } from "lucide-react";

function AlgorithmsPage() {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-icon">
        <Brain size={32} />
      </div>
      <h2 className="coming-soon-title">Раздел Алгоритмы в разработке</h2>
      <p className="coming-soon-desc">
        Мы готовим большую практическую базу задач с автотестами и разборами решений. Скоро здесь появятся новые упражнения!
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/react" className="home-section-btn">
          <Code2 size={16} /> Перейти к разделу React →
        </Link>
        <Link to="/javascript" className="home-section-btn" style={{ background: "#f59e0b" }}>
          <Zap size={16} /> Перейти к разделу JavaScript →
        </Link>
        <Link to="/home" className="home-section-btn-disabled" style={{ cursor: "pointer" }}>
          <Home size={14} /> На Главную
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/algorithms/")({
  component: AlgorithmsPage,
});
