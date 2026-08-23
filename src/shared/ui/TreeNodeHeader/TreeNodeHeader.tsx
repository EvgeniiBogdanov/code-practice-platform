import React, { forwardRef, HTMLAttributes, memo, ReactNode, Ref } from "react";
import { clsx } from "clsx";
import { Link } from "@tanstack/react-router";
import styles from "./TreeNodeHeader.module.css";

export interface TreeNodeHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  id?: string;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  role?: string;
  tabIndex?: number;
  className?: string;
}

export const TreeNodeHeader = memo(
  forwardRef<HTMLElement, TreeNodeHeaderProps>((props, ref) => {
    const {
      children,
      id,
      to,
      params,
      search,
      isActive,
      onClick,
      title,
      role,
      tabIndex,
      className,
      ...rest
    } = props;
    const cls = clsx(styles.treeNodeHeader, isActive && styles.active, className);

    if (to) {
      return (
        <Link
          ref={ref as Ref<HTMLAnchorElement>}
          id={id}
          to={to}
          params={params}
          search={search}
          onClick={onClick}
          title={title}
          className={cls}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        id={id}
        onClick={onClick}
        title={title}
        role={role}
        tabIndex={tabIndex}
        className={cls}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  })
);

TreeNodeHeader.displayName = "TreeNodeHeader";
