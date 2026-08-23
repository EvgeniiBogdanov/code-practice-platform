import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Atom, Zap, Brain, Code2 } from "lucide-react";
import styles from "./HeaderSectionNav.module.css";

export interface HeaderSectionNavProps {
  className?: string;
}

export const HeaderSectionNav = ({ className }: HeaderSectionNavProps) => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isReact = pathname.startsWith("/react") || pathname === "/";
  const isJs = pathname.startsWith("/javascript");
  const isAlgo = pathname.startsWith("/algorithms");
  const isEditor = pathname.startsWith("/editor");

  return (
    <nav className={[styles.navContainer, className].filter(Boolean).join(" ")}>
      <Link to="/" className={[styles.navItem, isReact && styles.active].filter(Boolean).join(" ")}>
        <Atom size={14} className={styles.iconReact} />
        <span>React</span>
      </Link>

      <Link
        to="/javascript"
        className={[styles.navItem, isJs && styles.active].filter(Boolean).join(" ")}
      >
        <Zap size={14} className={styles.iconJs} />
        <span>JavaScript</span>
      </Link>

      <Link
        to="/algorithms"
        className={[styles.navItem, isAlgo && styles.active].filter(Boolean).join(" ")}
      >
        <Brain size={14} className={styles.iconAlgo} />
        <span>Алгоритмы</span>
      </Link>

      <Link
        to="/editor"
        className={[styles.navItem, isEditor && styles.active].filter(Boolean).join(" ")}
      >
        <Code2 size={14} className={styles.iconEditor} />
        <span>Песочница</span>
      </Link>
    </nav>
  );
};
