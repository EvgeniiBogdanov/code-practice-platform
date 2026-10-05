import { memo } from "react";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/shared/ui";

export interface SettingsSignOutConfirmProps {
  isOpen: boolean;
  accountName: string;
  onConfirm: () => void;
  onClose: () => void;
}

/** Asks before signing out, so a stray click on the sidebar button cannot end the session. */
export const SettingsSignOutConfirm = memo(
  ({ isOpen, accountName, onConfirm, onClose }: SettingsSignOutConfirmProps) => (
    <ConfirmModal
      isOpen={isOpen}
      title="Выйти из профиля?"
      description={`Вы выйдете из профиля «${accountName}». Прогресс и решения останутся в этом браузере.`}
      icon={<LogOut size={18} />}
      actions={[{ label: "Выйти", onClick: onConfirm, variant: "primary" }]}
      onClose={onClose}
    />
  )
);

SettingsSignOutConfirm.displayName = "SettingsSignOutConfirm";
