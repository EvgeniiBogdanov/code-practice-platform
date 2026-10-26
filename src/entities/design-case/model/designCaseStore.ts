import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BoardValue } from "@/shared/ui/UiBoardEditor";
import { EMPTY_BOARD, EMPTY_STAGE_PROGRESS, getStageKey } from "./stageProgress";
import type { StageProgress } from "./types";

export interface DesignCaseState {
  /** Progress per `caseId:stageId`. */
  stages: Record<string, StageProgress>;
  /** The learner's scheme per case: one board drawn through all the stages, as on a real interview. */
  boards: Record<string, BoardValue>;
  /**
   * How many times each case was reset in this session (not saved). The board editor keeps its own
   * state once opened, so it is rebuilt when the number changes, and a save from the old one is dropped.
   */
  revisions: Record<string, number>;
  chooseOption: (caseId: string, stageId: string, forkId: string, optionId: string) => void;
  setAnswer: (caseId: string, stageId: string, answer: string) => void;
  setBoard: (caseId: string, board: BoardValue) => void;
  toggleRubricItem: (caseId: string, stageId: string, index: number) => void;
  /** Forgets the choices, answers, self-check marks and the board of one case. */
  resetCase: (caseId: string) => void;
}

const updateStage = (
  stages: Record<string, StageProgress>,
  caseId: string,
  stageId: string,
  patch: (current: StageProgress) => StageProgress
): Record<string, StageProgress> => {
  const key = getStageKey(caseId, stageId);
  return { ...stages, [key]: patch(stages[key] ?? EMPTY_STAGE_PROGRESS) };
};

export const useDesignCaseStore = create<DesignCaseState>()(
  persist(
    (set) => ({
      stages: {},
      boards: {},
      revisions: {},
      chooseOption: (caseId, stageId, forkId, optionId): void => {
        set((state) => ({
          stages: updateStage(state.stages, caseId, stageId, (current) => ({
            ...current,
            choices: { ...current.choices, [forkId]: optionId },
          })),
        }));
      },
      setAnswer: (caseId, stageId, answer): void => {
        set((state) => ({
          stages: updateStage(state.stages, caseId, stageId, (current) => ({
            ...current,
            answer,
          })),
        }));
      },
      setBoard: (caseId, board): void => {
        set((state) => ({ boards: { ...state.boards, [caseId]: board } }));
      },
      resetCase: (caseId): void => {
        set((state) => {
          const prefix = `${caseId}:`;
          return {
            stages: Object.fromEntries(
              Object.entries(state.stages).filter(([key]) => !key.startsWith(prefix))
            ),
            boards: Object.fromEntries(
              Object.entries(state.boards).filter(([key]) => key !== caseId)
            ),
            revisions: { ...state.revisions, [caseId]: (state.revisions[caseId] ?? 0) + 1 },
          };
        });
      },
      toggleRubricItem: (caseId, stageId, index): void => {
        set((state) => ({
          stages: updateStage(state.stages, caseId, stageId, (current) => ({
            ...current,
            rubric: current.rubric.includes(index)
              ? current.rubric.filter((checked) => checked !== index)
              : [...current.rubric, index],
          })),
        }));
      },
    }),
    {
      name: "playground_design_cases",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ stages: state.stages, boards: state.boards }),
    }
  )
);

export const selectStageProgress =
  (caseId: string, stageId: string) =>
  (state: DesignCaseState): StageProgress =>
    state.stages[getStageKey(caseId, stageId)] ?? EMPTY_STAGE_PROGRESS;

export const selectCaseBoard =
  (caseId: string) =>
  (state: DesignCaseState): BoardValue =>
    state.boards[caseId] ?? EMPTY_BOARD;

export const selectCaseRevision =
  (caseId: string) =>
  (state: DesignCaseState): number =>
    state.revisions[caseId] ?? 0;

const hasStageProgress = ({ choices, answer, rubric }: StageProgress): boolean =>
  Object.keys(choices).length > 0 || answer.trim().length > 0 || rubric.length > 0;

/** Whether there is anything to reset: a choice, an answer, a ticked item or a card on the board. */
export const selectHasCaseProgress =
  (caseId: string) =>
  (state: DesignCaseState): boolean =>
    (state.boards[caseId]?.nodes.length ?? 0) > 0 ||
    Object.entries(state.stages).some(
      ([key, progress]) => key.startsWith(`${caseId}:`) && hasStageProgress(progress)
    );
