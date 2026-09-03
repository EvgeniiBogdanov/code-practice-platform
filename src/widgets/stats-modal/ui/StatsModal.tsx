import { memo, lazy, Suspense } from "react";
import { Modal } from "@/shared/ui";
import { useStatsModalController } from "../model/useStatsModalController";
import { StatsModalSkeleton } from "./StatsModalSkeleton";
import styles from "./StatsModal.module.css";

const SpacedRepetitionSection = lazy(() =>
  import("@/features/spaced-repetition").then((module) => ({
    default: module.SpacedRepetitionSection,
  }))
);

export const StatsModal = memo((): React.JSX.Element => {
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
      <Suspense fallback={<StatsModalSkeleton />}>
        <SpacedRepetitionSection
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
