import React, { useState } from "react";
import { clsx } from "clsx";
import { GitHubIcon, UiReveal, UiScaledCanvas } from "@/shared/ui";
import { LANDING_SECTION, REPOSITORY_URL } from "../../config/landingLinks";
import { CreateAccountForm } from "../CreateAccount/CreateAccountForm";
import { ProfilePreview } from "../previews/ProfilePreview";
import { TextHighlight } from "../TextHighlight/TextHighlight";
import scene from "../scene.module.css";
import styles from "./StartSection.module.css";

export interface StartSectionProps {
  onAccountCreated: (targetPath?: string) => void;
}

export const StartSection = ({ onAccountCreated }: StartSectionProps): React.JSX.Element => {
  const [typedName, setTypedName] = useState("");

  return (
    <section
      id={LANDING_SECTION.start}
      className={clsx(styles.section, scene.scene)}
      aria-labelledby="landing-start-title"
    >
      <div className={scene.body}>
        <UiReveal variant="scale">
          <div className={styles.layout}>
            <div className={clsx(styles.visual, scene.depthFast)} aria-hidden="true" inert>
              <UiScaledCanvas width={520} height={420}>
                <ProfilePreview name={typedName} />
              </UiScaledCanvas>
            </div>

            <div className={styles.copy}>
              <h2 id="landing-start-title" className={styles.title}>
                Начни <TextHighlight>уже сейчас</TextHighlight>
              </h2>
              <p className={styles.text}>
                Локальный аккаунт - это только имя. Задачи, решения и график повторений хранятся в
                IndexedDB твоего браузера и синхронизируются между вкладками: без почты, пароля и
                серверов.
              </p>
              <CreateAccountForm onAccountCreated={onAccountCreated} onNameChange={setTypedName} />
              <p className={styles.note}>
                <GitHubIcon size={14} />
                Исходный код открыт —{" "}
                <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
                  EvgeniiBogdanov/code-practice-platform
                </a>
              </p>
            </div>
          </div>
        </UiReveal>
      </div>
    </section>
  );
};
