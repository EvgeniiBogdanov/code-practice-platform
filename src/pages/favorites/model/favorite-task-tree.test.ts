import { describe, expect, it } from "vitest";
import { Task } from "@/entities/task";
import { buildFavoriteTaskTree } from "./favorite-task-tree";

const createTask = (task: Partial<Task> & Pick<Task, "id" | "title" | "section">): Task => ({
  ...task,
});

describe("buildFavoriteTaskTree", () => {
  it("preserves the source folder and subfolder hierarchy", () => {
    const tree = buildFavoriteTaskTree([
      createTask({
        id: "js-1",
        title: "Map task",
        section: "javascript",
        group: "Коллекции",
        subgroup: "Map",
      }),
      createTask({
        id: "js-2",
        title: "Set task",
        section: "javascript",
        group: "Коллекции",
        subgroup: "Set",
      }),
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0].title).toBe("Коллекции");
    expect(tree[0].subfolders.map((node) => node.title)).toEqual(["Map", "Set"]);
    expect(tree[0].subfolders[0].tasks[0].id).toBe("js-1");
  });

  it("returns source folders without a root section node", () => {
    const tree = buildFavoriteTaskTree([
      createTask({ id: "js-1", title: "JS", section: "javascript", group: "Основы" }),
      createTask({ id: "js-2", title: "Promises", section: "javascript", group: "Асинхронность" }),
    ]);

    expect(tree.map((node) => node.title)).toEqual(["Основы", "Асинхронность"]);
    expect(tree.map((node) => node.tasks[0].id)).toEqual(["js-1", "js-2"]);
    expect(tree[0]).not.toHaveProperty("section");
  });
});
