import React from "react";
import { CheckCircle2, FileCode, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { UiKbd } from "@/shared/ui";
import { CodeLines } from "./CodeLines";
import { PreviewWindow } from "./PreviewCard";
import styles from "./SectionPreviews.module.css";
import local from "./EditorPreviews.module.css";

const HOOK_CODE = `export const useDebouncedValue = (value: string, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debounced;
};`;

export interface MultiCursorPreviewProps {
  isActive: boolean;
}

/** Editor with four multi-cursor selections, an IntelliSense popup and shortcut hints. */
export const MultiCursorPreview = ({ isActive }: MultiCursorPreviewProps): React.JSX.Element => (
  <div className={clsx(styles.stage, isActive && styles.active)}>
    <PreviewWindow
      className={clsx(styles.absolute, styles.stg, local.editorWindow)}
      icon={<FileCode size={13} />}
      title="use-debounced-value.ts"
      actions={
        <span className={local.prettier}>
          <CheckCircle2 size={12} />
          Prettier 3
        </span>
      }
    >
      <CodeLines code={HOOK_CODE} activeLine={5} selection="value" className={local.code} />
      <div className={styles.statusBar}>
        <span className={local.cursors}>4 курсора · «value»</span>
        <span className={styles.statusSpacer}>Стр 5, Кол 57</span>
        <span>TypeScript</span>
      </div>
    </PreviewWindow>

    <div className={clsx(styles.absolute, styles.stg, styles.i3, local.suggest)}>
      <div className={clsx(local.suggestItem, local.suggestActive)}>
        <span className={local.suggestKind}>ƒ</span>
        <b>clearTimeout</b>
        <span className={local.suggestType}>(id?: number) =&gt; void</span>
      </div>
      <div className={local.suggestItem}>
        <span className={local.suggestKind}>ƒ</span>
        clearInterval
        <span className={local.suggestType}>(id?: number) =&gt; void</span>
      </div>
      <p className={local.suggestDoc}>Отменяет таймер, созданный через setTimeout()</p>
    </div>

    <span className={clsx(styles.absolute, styles.stg, styles.i4, local.hint, local.hintSelect)}>
      <UiKbd keys={["⌘", "D"]} size="sm" />
      следующее вхождение
    </span>
    <span className={clsx(styles.absolute, styles.stg, styles.i5, local.hint, local.hintFormat)}>
      <Sparkles size={13} />
      <UiKbd keys={["⇧", "⌥", "F"]} size="sm" />
      форматировать
    </span>
  </div>
);
