import { memo } from "react";
import { useLocalAccountStore } from "@/shared/auth";
import { APP_VERSION } from "@/shared/config/ui-constants";
import { PlatformLogo } from "@/shared/ui";
import styles from "./HomePage.module.css";

export const HomeHeroHeader = memo(() => {
  const accountName = useLocalAccountStore((state) => state.account?.name);

  return (
    <div className={styles.pageHeader}>
      {accountName && <p className={styles.greeting}>Привет, {accountName}!</p>}
      <div className={styles.titleRow}>
        <PlatformLogo size={30} className={styles.titleIcon} />
        <h1 className={styles.mainTitle}>Code Practice Platform</h1>
        <span className={styles.versionTag}>v{APP_VERSION || "error"}</span>
      </div>
    </div>
  );
});

HomeHeroHeader.displayName = "HomeHeroHeader";
