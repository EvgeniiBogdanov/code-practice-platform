import React, { memo } from "react";
import {
  BookOpen,
  Code2,
  Terminal,
  Brain,
  RotateCcw,
  CheckCircle2,
  Gauge,
  Zap,
} from "lucide-react";
import { Card, TopicIconBox, TopicIconBoxColor } from "@/shared/ui";
import styles from "./HomePage.module.css";

interface FeatureCardProps {
  icon: React.ReactNode;
  colorVariant: TopicIconBoxColor;
  title: string;
  description: React.ReactNode;
}

const FeatureItem = memo(
  ({ icon, colorVariant, title, description }: FeatureCardProps): React.JSX.Element => (
    <Card className={styles.featureCard}>
      <div className={styles.featureHeader}>
        <TopicIconBox colorVariant={colorVariant} size="sm" hoverable={false}>
          {icon}
        </TopicIconBox>
        <h4 className={styles.featureTitle}>{title}</h4>
      </div>
      <p className={styles.featureDesc}>{description}</p>
    </Card>
  )
);

FeatureItem.displayName = "FeatureItem";

export const HomeFeaturesGrid = memo((): React.JSX.Element => {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.blockHeader}>
        <BookOpen size={16} color="var(--accent-blue, #3b82f6)" className={styles.blockIcon} />
        <h2 className={styles.blockTitle}>Возможности платформы</h2>
      </div>

      <div className={styles.featuresGrid}>
        <FeatureItem
          icon={<Code2 size={16} />}
          colorVariant="blue"
          title="Редактор и сплит-режим"
          description="Редактирование JS, TS и JSX/TSX с подсветкой синтаксиса, проверкой типов, всплывающими сигнатурами, Emmet, автоформатированием и сплит-режимом 70/30."
        />

        <FeatureItem
          icon={<Terminal size={16} />}
          colorVariant="amber"
          title="Веб-консоль и React Runner"
          description={
            <>
              Мгновенный запуск кода (Ctrl+Enter) с замером времени (
              <Zap size={12} color="#f59e0b" /> ms) и живой рендеринг компонентов React 19 с Zustand,
              Redux Toolkit и песочницей.
            </>
          }
        />

        <FeatureItem
          icon={<RotateCcw size={16} />}
          colorVariant="emerald"
          title="Интервальный помощник SM-2"
          description="Алгоритм повторения (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д), интерактивный мотивационный помощник, наглядная аналитика прогресса и исключение задач."
        />

        <FeatureItem
          icon={<Gauge size={16} />}
          colorVariant="red"
          title="Индекс вероятности на интервью"
          description="Оценка вероятности встретить задачу на live coding для Middle/Senior (BigTech, FinTech, E-commerce) и система мета-бейджей категорий."
        />

        <FeatureItem
          icon={<CheckCircle2 size={16} />}
          colorVariant="purple"
          title="Эталонные решения и теория"
          description="Оптимизированные решения O(N) / O(1) с разбором подводных камней, вариативностью подходов, вопросами интервьюера и чек-листами самопроверки."
        />

        <FeatureItem
          icon={<Brain size={16} />}
          colorVariant="cyan"
          title="Песочница кандидата и Review"
          description="Запускаемый live-код с реальными багами для отработки Code Review, быстрый поиск задач через Command Palette (Cmd+K) и раздел «Избранное»."
        />
      </div>
    </div>
  );
});

HomeFeaturesGrid.displayName = "HomeFeaturesGrid";
