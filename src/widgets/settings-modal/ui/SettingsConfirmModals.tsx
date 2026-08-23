import { memo } from "react";
import { useConfirmActions } from "../model/useConfirmActions";
import { SettingsResetConfirmDialog } from "./SettingsResetConfirmDialog";

export interface SettingsConfirmModalsProps {
  activeSection: string;
  sectionName: string;
  resetReviewsConfirmOpen: boolean;
  resetAllConfirmOpen: boolean;
  onCloseReviewsConfirm: () => void;
  onCloseAllConfirm: () => void;
  onResetSectionReviews: () => void;
  onResetAllReviews: () => void;
  onResetAllData: () => void;
}

export const SettingsConfirmModals = memo(
  ({
    activeSection,
    sectionName,
    resetReviewsConfirmOpen,
    resetAllConfirmOpen,
    onCloseReviewsConfirm,
    onCloseAllConfirm,
    onResetSectionReviews,
    onResetAllReviews,
    onResetAllData,
  }: SettingsConfirmModalsProps) => {
    const { reviewActions, allDataActions } = useConfirmActions(
      activeSection,
      sectionName,
      onResetSectionReviews,
      onResetAllReviews,
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
