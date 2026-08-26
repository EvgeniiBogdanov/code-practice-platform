import { memo } from "react";
import { ConfirmModal, ConfirmModalAction } from "@/shared/ui";

export type ConfirmAction = ConfirmModalAction;

export interface SettingsResetConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  actions: ConfirmAction[];
  onClose: () => void;
}

export const SettingsResetConfirmDialog = memo(
  ({ isOpen, title, description, actions, onClose }: SettingsResetConfirmDialogProps) => {
    return (
      <ConfirmModal
        isOpen={isOpen}
        title={title}
        description={description}
        actions={actions}
        onClose={onClose}
      />
    );
  }
);

SettingsResetConfirmDialog.displayName = "SettingsResetConfirmDialog";
