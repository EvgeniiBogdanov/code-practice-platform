import type { JSX } from "react";
import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import {
  CODE_LANGUAGE_OPTIONS,
  CodeWindow,
  CodeWindowPre,
  UiSelect,
  getLanguageMeta,
  type CodeLanguageOption,
} from "@/shared/ui";
import styles from "./CodeBlockView.module.css";

const PLAIN_TEXT = CODE_LANGUAGE_OPTIONS[0].value;

/** The option the block's language stands for, whatever alias its fence used (`js`, `javascript`). */
const resolveOption = (language: string | null): CodeLanguageOption => {
  const name = getLanguageMeta(language ?? undefined).name;
  return (
    CODE_LANGUAGE_OPTIONS.find((option) => option.name === name) ?? {
      value: language ?? PLAIN_TEXT,
      name,
    }
  );
};

/** A code block shown in the shared code window, with a language picker in its header. */
export const CodeBlockView = ({ node, updateAttributes, editor }: NodeViewProps): JSX.Element => {
  const language: string | null = node.attrs.language ?? null;
  const selected = resolveOption(language);
  const options = CODE_LANGUAGE_OPTIONS.some((option) => option.value === selected.value)
    ? CODE_LANGUAGE_OPTIONS
    : [...CODE_LANGUAGE_OPTIONS, selected];
  const code = node.textContent;

  return (
    <NodeViewWrapper className={styles.block}>
      <CodeWindow
        language={language ?? undefined}
        code={code}
        linesCount={code.split("\n").length}
        headerActions={
          <UiSelect
            controlSize="sm"
            aria-label="Язык кода"
            value={selected.value}
            disabled={!editor.isEditable}
            onChange={(event): void =>
              updateAttributes({
                language: event.target.value === PLAIN_TEXT ? null : event.target.value,
              })
            }
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </UiSelect>
        }
      >
        <CodeWindowPre>
          <code>
            <NodeViewContent />
          </code>
        </CodeWindowPre>
      </CodeWindow>
    </NodeViewWrapper>
  );
};
