import React, { memo } from "react";
import {
  BookOpen,
  Code2,
  Terminal,
  Brain,
  RotateCcw,
  CheckCircle2,
  ClipboardCheck,
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
          title="Редактор и анализ типов"
          description="Редактирование JS, TS и JSX/TSX с живой проверкой типов на лету, всплывающими подсказками сигнатур, Emmet JSX и автоформатированием Prettier."
        />

        <FeatureItem
          icon={<Terminal size={16} />}
          colorVariant="amber"
          title="Веб-консоль и React Runner"
          description={
            <>
              Мгновенный запуск кода (Ctrl+Enter) с замером времени (
              <Zap size={12} color="#f59e0b" /> ms) и живой рендеринг компонентов React с Redux
              Toolkit, Zustand и защитой от зацикливаний.
            </>
          }
        />

        <FeatureItem
          icon={<Brain size={16} />}
          colorVariant="purple"
          title="Песочница кандидата"
          description="Запускаемый live-код с реальными багами и недочетами кандидатов для отработки навыка проведения технического Code Review."
        />

        <FeatureItem
          icon={<RotateCcw size={16} />}
          colorVariant="emerald"
          title="Интервальное повторение SM-2"
          description="Календарный алгоритм закрепления задач (1д ➔ 3д ➔ 7д ➔ 14д ➔ 30д ➔ Мастер) с учетом часового пояса и автосбросом кода в день повтора."
        />

        <FeatureItem
          icon={<CheckCircle2 size={16} />}
          colorVariant="emerald"
          title="Эталонные решения"
          description="Оптимизированные решения с разбором сложности O(N) / O(1), выбором нескольких вариантов реализации и лучшими практиками собеседований."
        />

        <FeatureItem
          icon={<ClipboardCheck size={16} />}
          colorVariant="blue"
          title="Чек-листы, поиск и таймер"
          description="Критерии самопроверки и вопросы интервьюера, быстрый поиск задач через Command Palette (Cmd+K), таймер собеседования и шпаргалки."
        />
      </div>
    </div>
  );
});

HomeFeaturesGrid.displayName = "HomeFeaturesGrid";
