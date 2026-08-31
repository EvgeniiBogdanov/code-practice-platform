import { memo, useState } from "react";
import { Settings, Database, X } from "lucide-react";
import { clsx } from "clsx";
import { Modal } from "@/shared/ui";
import { useSettingsModal } from "../model/useSettingsModal";
import { SettingsResetSection } from "./SettingsResetSection";
import { SettingsConfirmModals } from "./SettingsConfirmModals";
import styles from "./SettingsModal.module.css";

export type SettingsTabType = "data";

export const SettingsModal = memo(() => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("data");

  const {
    isOpen,
    setIsOpen,
    sectionName,
    activeSection,
    resetReviewsConfirmOpen,
    setResetReviewsConfirmOpen,
    resetUIConfirmOpen,
    setResetUIConfirmOpen,
    resetAllConfirmOpen,
    setResetAllConfirmOpen,
    handleResetSectionReviews,
    handleResetAllReviews,
    handleResetUISettings,
    handleResetAllData,
  } = useSettingsModal();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        customHeader={<></>}
        className={styles.settingsModalCard}
        contentClassName={styles.settingsModalBody}
      >
        <aside className={styles.settingsSidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.workspaceHeader}>
              <div className={styles.workspaceIcon}>
                <Settings size={15} />
              </div>
              <div className={styles.workspaceInfo}>
                <span className={styles.workspaceName}>Настройки</span>
                <span className={styles.workspaceType}>Локальный профиль</span>
              </div>
            </div>

            <div className={styles.sidebarNavGroup}>
              <div className={styles.sidebarSectionTitle}>Управление</div>
              <nav className={styles.settingsNav} aria-label="Вкладки настроек">
                <button
                  type="button"
                  className={clsx(styles.navBtn, activeTab === "data" && styles.active)}
                  onClick={() => setActiveTab("data")}
                >
                  <Database size={15} className={styles.navBtnIcon} />
                  <span className={styles.navBtnLabel}>Данные приложения</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        <main className={styles.settingsMain}>
          <div className={styles.mainHeader}>
            <h2 className={styles.mainHeaderTitle}>Данные приложения</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть настройки"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.mainScrollable}>
            {activeTab === "data" && (
              <SettingsResetSection
                onOpenResetReviews={() => setResetReviewsConfirmOpen(true)}
                onOpenResetUI={() => setResetUIConfirmOpen(true)}
                onOpenResetAll={() => setResetAllConfirmOpen(true)}
              />
            )}
          </div>
        </main>
      </Modal>

      <SettingsConfirmModals
        activeSection={activeSection}
        sectionName={sectionName}
        resetReviewsConfirmOpen={resetReviewsConfirmOpen}
        resetUIConfirmOpen={resetUIConfirmOpen}
        resetAllConfirmOpen={resetAllConfirmOpen}
        onCloseReviewsConfirm={() => setResetReviewsConfirmOpen(false)}
        onCloseUIConfirm={() => setResetUIConfirmOpen(false)}
        onCloseAllConfirm={() => setResetAllConfirmOpen(false)}
        onResetSectionReviews={handleResetSectionReviews}
        onResetAllReviews={handleResetAllReviews}
        onResetUISettings={handleResetUISettings}
        onResetAllData={handleResetAllData}
      />
    </>
  );
});

SettingsModal.displayName = "SettingsModal";
