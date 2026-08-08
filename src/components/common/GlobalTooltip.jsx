import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const GlobalTooltip = () => {
  const [tooltipState, setTooltipState] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
    placement: "bottom", // 'bottom' | 'top'
  });

  const timerRef = useRef(null);
  const activeTargetRef = useRef(null);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (!target) return;

      const text = target.getAttribute("data-tooltip");
      if (!text || text.trim() === "") return;

      // Подавляем дефолтный браузерный title тултип, чтобы не открывались оба тултипа одновременно
      if (target.hasAttribute("title")) {
        target.setAttribute("data-suppressed-title", target.getAttribute("title"));
        target.removeAttribute("title");
      }

      activeTargetRef.current = target;

      if (timerRef.current) clearTimeout(timerRef.current);

      // Увеличенная комфортная задержка 650ms перед показом тултипа
      timerRef.current = setTimeout(() => {
        if (activeTargetRef.current !== target) return;

        const rect = target.getBoundingClientRect();
        const preferredPos = target.getAttribute("data-tooltip-pos") || "bottom";

        let placement = preferredPos;
        let x = rect.left + rect.width / 2;
        let y = rect.bottom + 6;

        // Если предпочитаем сверху
        if (preferredPos === "top") {
          y = rect.top - 6;
        }

        // Защита от выхода за границы экрана снизу/сверху
        if (placement === "bottom" && y + 36 > window.innerHeight) {
          placement = "top";
          y = rect.top - 6;
        } else if (placement === "top" && y - 36 < 0) {
          placement = "bottom";
          y = rect.bottom + 6;
        }

        // Защита от выхода за левый/правый край экрана
        const padding = 16;
        if (x < padding) x = padding;
        if (x > window.innerWidth - padding) x = window.innerWidth - padding;

        setTooltipState({
          visible: true,
          text,
          x,
          y,
          placement,
        });
      }, 650);
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (target) {
        if (target.hasAttribute("data-suppressed-title")) {
          target.setAttribute("title", target.getAttribute("data-suppressed-title"));
          target.removeAttribute("data-suppressed-title");
        }
        if (activeTargetRef.current === target) {
          if (timerRef.current) clearTimeout(timerRef.current);
          activeTargetRef.current = null;
          setTooltipState((prev) => ({ ...prev, visible: false }));
        }
      }
    };

    const handleDismiss = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activeTargetRef.current = null;
      setTooltipState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("mousedown", handleDismiss, true);
    document.addEventListener("click", handleDismiss, true);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("mousedown", handleDismiss, true);
      document.removeEventListener("click", handleDismiss, true);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!tooltipState.visible || !tooltipState.text) return null;

  return createPortal(
    <div
      className={`app-global-portal-tooltip placement-${tooltipState.placement}`}
      style={{
        left: `${tooltipState.x}px`,
        top: `${tooltipState.y}px`,
      }}
    >
      {tooltipState.text}
    </div>,
    document.body
  );
};

export default GlobalTooltip;
