import { memo, lazy, Suspense } from "react";
import { Modal } from "@/shared/ui";
import { useStatsModalController } from "../model/useStatsModalController";
import styles from "./StatsModal.module.css";

const LazySpacedRepetitionSection = lazy(() =>
  import("@/features/spaced-repetition").then((module) => ({
    default: module.SpacedRepetitionSection,
  }))
);

export const StatsModal = memo(() => {
  const { isOpen, setIsOpen, statsData } = useStatsModalController();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="xl"
      customHeader={<></>}
      className={styles.statsModal}
      contentClassName={styles.statsModalBody}
    >
      <Suspense fallback={<div className={styles.statsModalLoading}>Загрузка аналитики...</div>}>
        <LazySpacedRepetitionSection
          inModal={true}
          onNavigate={() => setIsOpen(false)}
          onCloseModal={() => setIsOpen(false)}
          taskList={statsData.taskList}
          sectionName={statsData.sectionName}
        />
      </Suspense>
    </Modal>
  );
});

StatsModal.displayName = "StatsModal";
