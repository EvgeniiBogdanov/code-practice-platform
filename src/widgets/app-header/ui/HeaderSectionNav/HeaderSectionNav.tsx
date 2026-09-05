import React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Code2, Brain } from "lucide-react";
import { clsx } from "clsx";
import { JavaScriptIcon, ReactIcon } from "@/shared/ui";
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
    <nav className={clsx(styles.navContainer, className)}>
      <Link to="/" className={clsx(styles.navItem, isReact && styles.active)}>
        <ReactIcon size={14} className={styles.iconReact} />
        <span>React</span>
      </Link>

      <Link
        to="/javascript"
        className={clsx(styles.navItem, isJs && styles.active)}
      >
        <JavaScriptIcon size={14} className={styles.iconJs} />
        <span>JavaScript</span>
      </Link>

      <Link
        to="/algorithms"
        className={clsx(styles.navItem, isAlgo && styles.active)}
      >
        <Brain size={14} className={styles.iconAlgo} />
        <span>Алгоритмы</span>
      </Link>

      <Link
        to="/editor"
        className={clsx(styles.navItem, isEditor && styles.active)}
      >
        <Code2 size={14} className={styles.iconEditor} />
        <span>Песочница</span>
      </Link>
    </nav>
  );
};
