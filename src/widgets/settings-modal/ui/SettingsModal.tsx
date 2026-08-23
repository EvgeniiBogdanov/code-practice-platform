import { memo } from "react";
import { Settings } from "lucide-react";
import { Modal } from "@/shared/ui";
import { useSettingsModal } from "../model/useSettingsModal";
import { SettingsResetSection } from "./SettingsResetSection";
import { SettingsConfirmModals } from "./SettingsConfirmModals";
import styles from "./SettingsModal.module.css";

export const SettingsModal = memo(() => {
  const {
    isOpen,
    setIsOpen,
    sectionName,
    activeSection,
    resetReviewsConfirmOpen,
    setResetReviewsConfirmOpen,
    resetAllConfirmOpen,
    setResetAllConfirmOpen,
    handleResetSectionReviews,
    handleResetAllReviews,
    handleResetAllData,
  } = useSettingsModal();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
        title="Настройки платформы"
        icon={<Settings size={18} />}
        className={styles.settingsModalCard}
        contentClassName={styles.settingsModalBody}
      >
        <SettingsResetSection
          onOpenResetReviews={() => setResetReviewsConfirmOpen(true)}
          onOpenResetAll={() => setResetAllConfirmOpen(true)}
        />
      </Modal>

      <SettingsConfirmModals
        activeSection={activeSection}
        sectionName={sectionName}
        resetReviewsConfirmOpen={resetReviewsConfirmOpen}
        resetAllConfirmOpen={resetAllConfirmOpen}
        onCloseReviewsConfirm={() => setResetReviewsConfirmOpen(false)}
        onCloseAllConfirm={() => setResetAllConfirmOpen(false)}
        onResetSectionReviews={handleResetSectionReviews}
        onResetAllReviews={handleResetAllReviews}
        onResetAllData={handleResetAllData}
      />
    </>
  );
});

SettingsModal.displayName = "SettingsModal";
