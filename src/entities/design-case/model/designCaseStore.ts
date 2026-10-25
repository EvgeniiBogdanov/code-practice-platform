import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { EMPTY_STAGE_PROGRESS, getStageKey } from "./stageProgress";
import type { StageProgress } from "./types";

export interface DesignCaseState {
  /** Progress per `caseId:stageId`. */
  stages: Record<string, StageProgress>;
  chooseOption: (caseId: string, stageId: string, forkId: string, optionId: string) => void;
  setAnswer: (caseId: string, stageId: string, answer: string) => void;
  toggleRubricItem: (caseId: string, stageId: string, index: number) => void;
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
      partialize: (state) => ({ stages: state.stages }),
    }
  )
);

export const selectStageProgress =
  (caseId: string, stageId: string) =>
  (state: DesignCaseState): StageProgress =>
    state.stages[getStageKey(caseId, stageId)] ?? EMPTY_STAGE_PROGRESS;
