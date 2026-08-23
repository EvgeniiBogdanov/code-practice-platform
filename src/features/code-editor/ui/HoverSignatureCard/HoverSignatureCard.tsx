import React from "react";
import { HoverInfo } from "@/shared/lib/code-editor";
import styles from "./HoverSignatureCard.module.css";

export interface HoverSignatureCardProps {
  info: HoverInfo;
  position: { top: number; left: number };
  className?: string;
}

export function HoverSignatureCard({ info, position, className }: HoverSignatureCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.top = `${position.top}px`;
      cardRef.current.style.left = `${position.left}px`;
    }
  }, [position.top, position.left]);

  return (
    <div ref={cardRef} className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.signature}>{info.signature}</div>
      {info.documentation && <div className={styles.description}>{info.documentation}</div>}
    </div>
  );
}
