import { ReviewItem } from "@/entities/review";
import { Task } from "@/entities/task";

export interface RobotMessageParams {
  taskReview: ReviewItem | null;
  canRate: boolean;
  task?: Task;
  isUnsolved?: boolean;
  statusUpdatedAt?: number;
}

export interface RobotMessageResult {
  text: string;
  highlight?: string;
}

export type UnsolvedTimeframe = "day0" | "next_day" | "week" | "month";

export type OverdueTimeframe = "week1" | "week2" | "month";
