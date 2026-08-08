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

      activeTargetRef.current = target;

      if (timerRef.current) clearTimeout(timerRef.current);

      // Задержка 350ms перед показом
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
      }, 350);
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest("[data-tooltip]");
      if (target && activeTargetRef.current === target) {
        if (timerRef.current) clearTimeout(timerRef.current);
        activeTargetRef.current = null;
        setTooltipState((prev) => ({ ...prev, visible: false }));
      }
    };

    const handleScrollOrResize = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activeTargetRef.current = null;
      setTooltipState((prev) => ({ ...prev, visible: false }));
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize, true);
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
