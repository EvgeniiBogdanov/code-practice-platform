import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import React from "react";
import { ConfirmAction } from "../ui/SettingsResetConfirmDialog";

export function useConfirmActions(
  activeSection: string,
  sectionName: string,
  onResetSectionReviews: () => void,
  onResetAllReviews: () => void,
  onResetAllData: () => void
) {
  const reviewActions: ConfirmAction[] = useMemo(() => {
    const list: ConfirmAction[] = [];
    if (activeSection !== "home") {
      list.push({
        label: `Сбросить повторения раздела «${sectionName}»`,
        onClick: onResetSectionReviews,
        variant: "danger",
        icon: React.createElement(Trash2, { size: 14 }),
      });
    }
    list.push({
      label: "Сбросить повторения всей платформы",
      onClick: onResetAllReviews,
      variant: "danger",
      icon: React.createElement(Trash2, { size: 14 }),
    });
    return list;
  }, [activeSection, sectionName, onResetSectionReviews, onResetAllReviews]);

  const allDataActions: ConfirmAction[] = useMemo(
    () => [
      {
        label: "Сбросить всю статистику, решения и чек-листы",
        onClick: onResetAllData,
        variant: "danger",
        icon: React.createElement(Trash2, { size: 14 }),
      },
    ],
    [onResetAllData]
  );

  return {
    reviewActions,
    allDataActions,
  };
}
