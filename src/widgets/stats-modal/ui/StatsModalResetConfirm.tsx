import { memo, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal, ConfirmModalAction } from "@/shared/ui";

export interface StatsModalResetConfirmProps {
  isOpen: boolean;
  sectionName: string;
  onClose: () => void;
  onResetSection: () => void;
  onResetAll: () => void;
}

export const StatsModalResetConfirm = memo(
  ({ isOpen, sectionName, onClose, onResetSection, onResetAll }: StatsModalResetConfirmProps) => {
    const actions = useMemo<ConfirmModalAction[]>(() => {
      const list: ConfirmModalAction[] = [];
      if (sectionName !== "Вся платформа") {
        list.push({
          label: `Сбросить повторения раздела «${sectionName}»`,
          onClick: onResetSection,
          variant: "danger",
          icon: <Trash2 size={14} />,
        });
      }
      list.push({
        label: "Сбросить повторения всей платформы",
        onClick: onResetAll,
        variant: "danger",
        icon: <Trash2 size={14} />,
      });
      return list;
    }, [sectionName, onResetSection, onResetAll]);

    return (
      <ConfirmModal
        isOpen={isOpen}
        title="Подтверждение сброса"
        description="Вы действительно хотите сбросить график и интервалы повторений? Это действие необратимо."
        actions={actions}
        onClose={onClose}
      />
    );
  }
);

StatsModalResetConfirm.displayName = "StatsModalResetConfirm";
