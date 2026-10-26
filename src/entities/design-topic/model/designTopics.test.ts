import { describe, expect, it } from "vitest";
import { DESIGN_TOPICS } from "../content/topics";
import { getDesignTopic, loadDesignTopicArticle } from "./designTopics";

describe("design topics", () => {
  it("has a unique id and a non-empty article for every topic", async () => {
    const ids = DESIGN_TOPICS.map((topic) => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect((await loadDesignTopicArticle(id))?.trim()).toBeTruthy();
    }
  });

  it("starts every article with text, not a title: the page already shows the topic title", async () => {
    for (const { id } of DESIGN_TOPICS) {
      const article = (await loadDesignTopicArticle(id)) ?? "";
      expect(article.trimStart(), id).not.toMatch(/^# /);
    }
  });

  it("returns null for an unknown article and undefined for an unknown topic", async () => {
    expect(await loadDesignTopicArticle("no-such-topic")).toBeNull();
    expect(getDesignTopic("no-such-topic")).toBeUndefined();
  });
});
