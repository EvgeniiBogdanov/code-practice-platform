import { DESIGN_TOPICS } from "../content/topics";
import type { DesignTopic } from "./types";

const ARTICLE_LOADERS = import.meta.glob<string>("../content/*.md", {
  query: "?raw",
  import: "default",
});

export const getDesignTopic = (topicId: string): DesignTopic | undefined =>
  DESIGN_TOPICS.find((topic) => topic.id === topicId);

/** Markdown of an article, fetched on first open; `null` for an unknown id. */
export const loadDesignTopicArticle = async (topicId: string): Promise<string | null> => {
  const load = ARTICLE_LOADERS[`../content/${topicId}.md`];
  return load ? load() : null;
};
