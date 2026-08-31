import { memo } from "react";
import { useConfirmActions } from "../model/useConfirmActions";
import { SettingsResetConfirmDialog } from "./SettingsResetConfirmDialog";

export interface SettingsConfirmModalsProps {
  activeSection: string;
  sectionName: string;
  resetReviewsConfirmOpen: boolean;
  resetUIConfirmOpen: boolean;
  resetAllConfirmOpen: boolean;
  onCloseReviewsConfirm: () => void;
  onCloseUIConfirm: () => void;
  onCloseAllConfirm: () => void;
  onResetSectionReviews: () => void;
  onResetAllReviews: () => void;
  onResetUISettings: () => void;
  onResetAllData: () => void;
}

export const SettingsConfirmModals = memo(
  ({
    activeSection,
    sectionName,
    resetReviewsConfirmOpen,
    resetUIConfirmOpen,
    resetAllConfirmOpen,
    onCloseReviewsConfirm,
    onCloseUIConfirm,
    onCloseAllConfirm,
    onResetSectionReviews,
    onResetAllReviews,
    onResetUISettings,
    onResetAllData,
  }: SettingsConfirmModalsProps) => {
    const { reviewActions, uiSettingsActions, allDataActions } = useConfirmActions(
      activeSection,
      sectionName,
      onResetSectionReviews,
      onResetAllReviews,
      onResetUISettings,
      onResetAllData
    );

    return (
      <>
        <SettingsResetConfirmDialog
          isOpen={resetReviewsConfirmOpen}
          title="Сброс графика повторений"
          description="Вы действительно хотите сбросить интервалы и стадии повторения задач (SM-2)? Это действие необратимо."
          actions={reviewActions}
          onClose={onCloseReviewsConfirm}
        />

        <SettingsResetConfirmDialog
          isOpen={resetUIConfirmOpen}
          title="Сброс настроек интерфейса"
          description="Будут сброшены размеры боковой панели и редактора, масштаб шрифтов, вид отображения списков и карточек, а также раскрытые разделы. Ваш прогресс, код решений и избранные задачи останутся нетронутыми."
          actions={uiSettingsActions}
          onClose={onCloseUIConfirm}
        />

        <SettingsResetConfirmDialog
          isOpen={resetAllConfirmOpen}
          title="Сброс всей статистики и решений"
          description="Внимание! Будут безвозвратно удалены все статусы решённых задач, весь написанный вами код решений в IndexedDB и отметки чек-листов по всей платформе."
          actions={allDataActions}
          onClose={onCloseAllConfirm}
        />
      </>
    );
  }
);

SettingsConfirmModals.displayName = "SettingsConfirmModals";
