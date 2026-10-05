import React, { memo, useState } from "react";
import { UiKbd } from "@/shared/ui";
import { isApplePlatform } from "@/shared/lib/platform";
import { EDITOR_HOTKEY_GROUPS, resolveHotkeyKeys } from "../lib/editorHotkeys";
import styles from "./SettingsHotkeysList.module.css";

/** Every shortcut of the app with what it does, written for the user's platform. */
export const SettingsHotkeysList = memo((): React.JSX.Element => {
  const [apple] = useState(isApplePlatform);

  return (
    <div className={styles.groups}>
      {EDITOR_HOTKEY_GROUPS.map((group) => (
        <section key={group.title} className={styles.group} aria-label={group.title}>
          <h4 className={styles.groupTitle}>{group.title}</h4>
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item.description} className={styles.item}>
                <span className={styles.description}>{item.description}</span>
                <UiKbd className={styles.keys} keys={resolveHotkeyKeys(item, apple)} size="sm" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
});

SettingsHotkeysList.displayName = "SettingsHotkeysList";
