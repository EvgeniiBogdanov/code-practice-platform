import { memo, useState } from "react";
import { Settings, Database, Palette, X, UserRound, LogOut, Code2 } from "lucide-react";
import { clsx } from "clsx";
import { useLocalAccountStore } from "@/shared/auth";
import { Modal } from "@/shared/ui";
import { useSettingsModal } from "../model/useSettingsModal";
import { SettingsAccountSection } from "./SettingsAccountSection";
import { SettingsResetSection } from "./SettingsResetSection";
import { SettingsCustomizationSection } from "./SettingsCustomizationSection";
import { SettingsEditorSection } from "./SettingsEditorSection";
import { SettingsConfirmModals } from "./SettingsConfirmModals";
import { SettingsSignOutConfirm } from "./SettingsSignOutConfirm";
import styles from "./SettingsModal.module.css";

export type SettingsTabType = "account" | "data" | "customization" | "editor";

const TAB_COPY: Record<SettingsTabType, { title: string; subtitle: string }> = {
  account: { title: "Аккаунт", subtitle: "Имя локального профиля" },
  customization: {
    title: "Кастомизация",
    subtitle: "Тема оформления, элементы интерфейса и персонализация помощника",
  },
  editor: {
    title: "Редактор кода",
    subtitle:
      "Общие настройки редактора для всех задач: шрифт, перенос строк, подсказки и горячие клавиши",
  },
  data: {
    title: "Данные приложения",
    subtitle: "Управление локальным хранилищем, графиком повторения и сбросом данных",
  },
};

export const SettingsModal = memo(() => {
  const [selectedTab, setSelectedTab] = useState<SettingsTabType | null>(null);
  const accountName = useLocalAccountStore((state) => state.account?.name);
  const signOut = useLocalAccountStore((state) => state.signOut);

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
    signOutConfirmOpen,
    setSignOutConfirmOpen,
    handleResetSectionReviews,
    handleResetAllReviews,
    handleResetUISettings,
    handleResetAllData,
  } = useSettingsModal();

  // Every opening starts on the first tab of the sidebar.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSelectedTab(null);
  }
  const activeTab = selectedTab ?? (accountName ? "account" : "customization");

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        // One Escape closes one window: while a confirmation is open it belongs to that dialog.
        closeOnEscape={
          !(
            resetReviewsConfirmOpen ||
            resetUIConfirmOpen ||
            resetAllConfirmOpen ||
            signOutConfirmOpen
          )
        }
        customHeader={<></>}
        className={styles.settingsModalCard}
        contentClassName={styles.settingsModalBody}
      >
        <aside className={styles.settingsSidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.workspaceHeader}>
              <div className={clsx(styles.workspaceIcon, accountName && styles.profileAvatar)}>
                {accountName ? accountName.charAt(0).toUpperCase() : <Settings size={15} />}
              </div>
              <div className={styles.workspaceInfo}>
                <span className={styles.workspaceName}>{accountName ?? "Настройки"}</span>
                <span className={styles.workspaceType}>Локальный профиль</span>
              </div>
            </div>

            <div className={styles.sidebarNavGroup}>
              <div className={styles.sidebarSectionTitle}>Управление</div>
              <nav className={styles.settingsNav} aria-label="Вкладки настроек">
                {accountName && (
                  <button
                    type="button"
                    className={clsx(styles.navBtn, activeTab === "account" && styles.active)}
                    onClick={() => setSelectedTab("account")}
                  >
                    <UserRound size={15} className={styles.navBtnIcon} />
                    <span className={styles.navBtnLabel}>Аккаунт</span>
                  </button>
                )}
                <button
                  type="button"
                  className={clsx(styles.navBtn, activeTab === "customization" && styles.active)}
                  onClick={() => setSelectedTab("customization")}
                >
                  <Palette size={15} className={styles.navBtnIcon} />
                  <span className={styles.navBtnLabel}>Кастомизация</span>
                </button>
                <button
                  type="button"
                  className={clsx(styles.navBtn, activeTab === "editor" && styles.active)}
                  onClick={() => setSelectedTab("editor")}
                >
                  <Code2 size={15} className={styles.navBtnIcon} />
                  <span className={styles.navBtnLabel}>Редактор кода</span>
                </button>
                <button
                  type="button"
                  className={clsx(styles.navBtn, activeTab === "data" && styles.active)}
                  onClick={() => setSelectedTab("data")}
                >
                  <Database size={15} className={styles.navBtnIcon} />
                  <span className={styles.navBtnLabel}>Данные приложения</span>
                </button>
              </nav>
            </div>
          </div>
          {accountName && (
            <div className={styles.sidebarBottom}>
              <button
                type="button"
                className={clsx(styles.navBtn, styles.signOutBtn)}
                onClick={() => setSignOutConfirmOpen(true)}
              >
                <LogOut size={15} className={styles.navBtnIcon} />
                <span className={styles.navBtnLabel}>Выйти из профиля</span>
              </button>
              <p className={styles.signOutHint}>Прогресс и решения останутся в этом браузере</p>
            </div>
          )}
        </aside>

        <main className={styles.settingsMain}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть настройки"
          >
            <X size={16} />
          </button>

          <div className={styles.mainScrollable}>
            <div className={styles.pageHeader}>
              <h2 className={styles.pageTitle}>{TAB_COPY[activeTab].title}</h2>
              <p className={styles.pageSubtitle}>{TAB_COPY[activeTab].subtitle}</p>
            </div>

            {activeTab === "account" && accountName && (
              <SettingsAccountSection accountName={accountName} />
            )}
            {activeTab === "data" && (
              <SettingsResetSection
                onOpenResetReviews={() => setResetReviewsConfirmOpen(true)}
                onOpenResetUI={() => setResetUIConfirmOpen(true)}
                onOpenResetAll={() => setResetAllConfirmOpen(true)}
              />
            )}
            {activeTab === "customization" && <SettingsCustomizationSection />}
            {activeTab === "editor" && <SettingsEditorSection />}
          </div>
        </main>
      </Modal>

      {accountName && (
        <SettingsSignOutConfirm
          isOpen={signOutConfirmOpen}
          accountName={accountName}
          onConfirm={() => {
            setSignOutConfirmOpen(false);
            signOut();
          }}
          onClose={() => setSignOutConfirmOpen(false)}
        />
      )}

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
