/** Where a topic sits on the theory page: the interview process, frontend foundations or cross-cutting concerns. */
export type DesignTopicGroup = "process" | "foundation" | "crosscutting";

export interface DesignTopic {
  id: string;
  title: string;
  summary: string;
  /** Rough reading time, shown next to the title. */
  minutes: number;
  group: DesignTopicGroup;
}
