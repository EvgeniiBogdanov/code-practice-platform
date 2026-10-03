import React, { useEffect } from "react";
import { safeDecodeURI } from "@/shared/lib/url";
import { useSceneScroll } from "../lib/use-scene-scroll";
import { CatalogSection } from "./CatalogSection/CatalogSection";
import { CreateAccountDialog } from "./CreateAccount/CreateAccountDialog";
import { EditorSection } from "./EditorSection/EditorSection";
import { HeroSection } from "./HeroSection/HeroSection";
import { LandingFooter } from "./LandingFooter/LandingFooter";
import { LandingNav } from "./LandingNav/LandingNav";
import { PracticeSection } from "./PracticeSection/PracticeSection";
import { ProbabilitySection } from "./ProbabilitySection/ProbabilitySection";
import { RunnerSection } from "./RunnerSection/RunnerSection";
import { StartSection } from "./StartSection/StartSection";
import styles from "./LandingPage.module.css";

export interface LandingPageProps {
  /** Opens the workspace after the local account is created (optionally on a given path). */
  onAccountCreated: (targetPath?: string) => void;
}

const isReload = (): boolean => {
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return entry?.type === "reload";
};

/**
 * The landing mounts after a dynamic import, so the browser's own jump to `#section` is lost.
 * A reload always opens the first scene instead of the position the browser remembers from the
 * snap-scrolled page (anchors from in-page navigation are dropped as well).
 */
const placeInitialScroll = (): (() => void) => {
  window.history.scrollRestoration = "manual";

  if (isReload() && window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  const id = safeDecodeURI(window.location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);

  return () => {
    window.history.scrollRestoration = "auto";
  };
};

export const LandingPage = ({ onAccountCreated }: LandingPageProps): React.JSX.Element => {
  useEffect(placeInitialScroll, []);
  useSceneScroll();

  return (
    <div id="top" className={styles.page}>
      <a className={styles.skipLink} href="#landing-main">
        Перейти к содержимому
      </a>
      <LandingNav />
      <main id="landing-main">
        <HeroSection />
        <PracticeSection />
        <CatalogSection />
        <ProbabilitySection />
        <EditorSection />
        <RunnerSection />
        <StartSection onAccountCreated={onAccountCreated} />
      </main>
      <LandingFooter />
      <CreateAccountDialog onAccountCreated={onAccountCreated} />
    </div>
  );
};
