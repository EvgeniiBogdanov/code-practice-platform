import React from "react";
import { HardDrive, RefreshCw, ShieldCheck } from "lucide-react";
import { Modal, PlatformLogo } from "@/shared/ui";
import { useCreateAccountDialog } from "../../model/createAccountDialog";
import { CreateAccountForm } from "./CreateAccountForm";
import styles from "./CreateAccount.module.css";

const LOCAL_FIRST_FACTS = [
  { Icon: HardDrive, text: "Задачи, решения и повторения хранятся в IndexedDB этого браузера" },
  { Icon: RefreshCw, text: "Прогресс мгновенно синхронизируется между открытыми вкладками" },
  { Icon: ShieldCheck, text: "Без почты, пароля и сторонних серверов — только имя" },
] as const;

export interface CreateAccountDialogProps {
  onAccountCreated: (targetPath?: string) => void;
}

export const CreateAccountDialog = ({
  onAccountCreated,
}: CreateAccountDialogProps): React.JSX.Element => {
  const isOpen = useCreateAccountDialog((state) => state.isOpen);
  const target = useCreateAccountDialog((state) => state.target);
  const close = useCreateAccountDialog((state) => state.close);

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      size="sm"
      icon={<PlatformLogo size={20} />}
      title="Создать локальный аккаунт"
      description="Займёт пять секунд"
      contentClassName={styles.dialogContent}
    >
      <CreateAccountForm onAccountCreated={onAccountCreated} target={target} autoFocus />
      <ul className={styles.facts}>
        {LOCAL_FIRST_FACTS.map(({ Icon, text }) => (
          <li key={text} className={styles.fact}>
            <Icon size={15} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
    </Modal>
  );
};
