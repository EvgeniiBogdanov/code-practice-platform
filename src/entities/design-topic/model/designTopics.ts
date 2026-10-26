import { DESIGN_TOPICS } from "../content/topics";
import type { DesignTopic } from "./types";

const ARTICLE_LOADERS = import.meta.glob<string>("../content/*.md", {
  query: "?raw",
  import: "default",
});

export const getDesignTopic = (topicId: string): DesignTopic | undefined =>
  DESIGN_TOPICS.find((topic) => topic.id === topicId);

export interface AdjacentDesignTopics {
  previous?: DesignTopic;
  next?: DesignTopic;
}

/** The articles on both sides of one in the reading order; none for an unknown id or the ends of the list. */
export const getAdjacentDesignTopics = (topicId: string): AdjacentDesignTopics => {
  const index = DESIGN_TOPICS.findIndex((topic) => topic.id === topicId);
  if (index === -1) return {};
  return { previous: DESIGN_TOPICS[index - 1], next: DESIGN_TOPICS[index + 1] };
};

/** Markdown of an article, fetched on first open; `null` for an unknown id. */
export const loadDesignTopicArticle = async (topicId: string): Promise<string | null> => {
  const load = ARTICLE_LOADERS[`../content/${topicId}.md`];
  return load ? load() : null;
};
