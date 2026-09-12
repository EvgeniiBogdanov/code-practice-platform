export interface StackSceneLane {
  readonly label: string;
  readonly values: readonly (string | number)[];
}
export interface StackSceneAction {
  readonly kind: "push" | "pop" | "peek";
  readonly before: readonly StackSceneLane[];
  readonly items: readonly { readonly lane: number; readonly value: string | number }[];
}
export interface UiStackSceneProps {
  readonly stacks: readonly StackSceneLane[];
  readonly action?: StackSceneAction;
  readonly stepId: string;
  readonly reducedMotion: boolean;
  readonly zoom?: number;
  readonly onZoomChange?: (zoom: number) => void;
}
export interface StackFrameProps {
  readonly stacks: readonly StackSceneLane[];
  readonly action?: StackSceneAction;
  readonly after: boolean;
  readonly floor: number;
  readonly stepId: string;
  readonly marker: string;
}
