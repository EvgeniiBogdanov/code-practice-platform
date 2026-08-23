import { memo, lazy, Suspense } from "react";
import { Brain } from "lucide-react";
import { Modal } from "@/shared/ui";
import { useStatsModalController } from "../model/useStatsModalController";
import styles from "./StatsModal.module.css";

const LazySpacedRepetitionSection = lazy(() =>
  import("@/features/spaced-repetition").then((module) => ({
    default: module.SpacedRepetitionSection,
  }))
);

export const StatsModal = memo(() => {
  const { isOpen, setIsOpen, statsData, modalTitle } = useStatsModalController();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="xl"
      title={modalTitle}
      icon={<Brain size={18} style={{ color: "var(--accent-purple, #a855f7)" }} />}
      className={styles.statsModal}
      contentClassName={styles.statsModalBody}
    >
      <Suspense fallback={<div className={styles.statsModalLoading}>Загрузка аналитики...</div>}>
        <LazySpacedRepetitionSection
          inModal={true}
          onNavigate={() => setIsOpen(false)}
          taskList={statsData.taskList}
          sectionName={statsData.sectionName}
        />
      </Suspense>
    </Modal>
  );
});

StatsModal.displayName = "StatsModal";
