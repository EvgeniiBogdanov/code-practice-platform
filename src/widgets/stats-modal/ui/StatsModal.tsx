import { memo } from "react";
import { Modal } from "@/shared/ui";
import { SpacedRepetitionSection } from "@/features/spaced-repetition";
import { useStatsModalController } from "../model/useStatsModalController";
import styles from "./StatsModal.module.css";

export const StatsModal = memo((): React.JSX.Element => {
  const { isOpen, setIsOpen, statsData } = useStatsModalController();

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      customHeader={<></>}
      className={styles.statsModal}
      contentClassName={styles.statsModalBody}
    >
      <SpacedRepetitionSection
        inModal={true}
        onNavigate={handleClose}
        onCloseModal={handleClose}
        taskList={statsData.taskList}
        sectionName={statsData.sectionName}
      />
    </Modal>
  );
});

StatsModal.displayName = "StatsModal";
