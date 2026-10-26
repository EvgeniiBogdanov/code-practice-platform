import { describe, expect, it } from "vitest";
import { DESIGN_TOPICS } from "../content/topics";
import { getAdjacentDesignTopics, getDesignTopic, loadDesignTopicArticle } from "./designTopics";

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

  describe("getAdjacentDesignTopics", () => {
    const first = DESIGN_TOPICS[0];
    const second = DESIGN_TOPICS[1];
    const third = DESIGN_TOPICS[2];
    const last = DESIGN_TOPICS[DESIGN_TOPICS.length - 1];
    const beforeLast = DESIGN_TOPICS[DESIGN_TOPICS.length - 2];

    it("gives the articles on both sides of one in the middle", () => {
      expect(getAdjacentDesignTopics(second?.id ?? "")).toEqual({ previous: first, next: third });
    });

    it("has no previous article for the first one and no next one for the last", () => {
      expect(getAdjacentDesignTopics(first?.id ?? "")).toEqual({
        previous: undefined,
        next: second,
      });
      expect(getAdjacentDesignTopics(last?.id ?? "")).toEqual({
        previous: beforeLast,
        next: undefined,
      });
    });

    it("gives nothing for an unknown article", () => {
      expect(getAdjacentDesignTopics("no-such-topic")).toEqual({});
    });
  });

  it("returns null for an unknown article and undefined for an unknown topic", async () => {
    expect(await loadDesignTopicArticle("no-such-topic")).toBeNull();
    expect(getDesignTopic("no-such-topic")).toBeUndefined();
  });
});
