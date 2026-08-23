import React from "react";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { Button } from "@/shared/ui";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.container}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.desc}>
        Запрашиваемая страница или задача не существует либо была перемещена.
      </p>
      <Link to="/" className={styles.link}>
        <Button variant="primary">
          <Home size={16} />
          <span>На главную страницу</span>
        </Button>
      </Link>
    </div>
  );
}
