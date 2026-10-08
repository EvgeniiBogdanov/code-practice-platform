import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const spellcheckKey = new PluginKey<boolean>("spellcheckOnFocus");

/**
 * The page opens as something to read, so the browser's red squiggles stay off until the
 * reader clicks in to edit, and go away again when the editor loses focus.
 */
export const SpellcheckOnFocus = Extension.create({
  name: "spellcheckOnFocus",

  addProseMirrorPlugins() {
    return [
      new Plugin<boolean>({
        key: spellcheckKey,
        state: {
          init: () => false,
          apply: (tr, isFocused) => tr.getMeta(spellcheckKey) ?? isFocused,
        },
        props: {
          attributes: (state) => ({ spellcheck: String(spellcheckKey.getState(state) === true) }),
          handleDOMEvents: {
            focus: (view) => {
              view.dispatch(view.state.tr.setMeta(spellcheckKey, true));
              return false;
            },
            blur: (view) => {
              view.dispatch(view.state.tr.setMeta(spellcheckKey, false));
              return false;
            },
          },
        },
      }),
    ];
  },
});
