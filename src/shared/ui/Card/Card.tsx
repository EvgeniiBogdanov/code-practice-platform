import React, { memo } from "react";
import { clsx } from "clsx";
import styles from "./Card.module.css";

export type CardVariant = "default" | "subtle" | "elevated" | "interactive" | "ghost";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: React.ReactNode;
  className?: string;
}

export const Card = memo(({ variant = "default", children, className, ...props }: CardProps) => {
  const classNames = clsx(styles.card, styles[variant], className);

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader = memo(({ children, className, ...props }: CardHeaderProps) => {
  return (
    <div className={clsx(styles.header, className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardTitle = memo(({ children, className, ...props }: CardTitleProps) => {
  return (
    <h3 className={clsx(styles.title, className)} {...props}>
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardDescription = memo(({ children, className, ...props }: CardDescriptionProps) => {
  return (
    <p className={clsx(styles.description, className)} {...props}>
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardContent = memo(({ children, className, ...props }: CardContentProps) => {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const CardFooter = memo(({ children, className, ...props }: CardFooterProps) => {
  return (
    <div className={clsx(styles.footer, className)} {...props}>
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";
