import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GroupMetaBadges } from "./GroupMetaBadges";

describe("GroupMetaBadges", () => {
  it("does not render the meta row when a folder has no badges", () => {
    const { container } = render(
      <GroupMetaBadges
        readingTimeMinutes={0}
        hasArticle={false}
        hasPracticeTasks={false}
        hasArticleLinks={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the meta row when a folder has a badge", () => {
    render(
      <GroupMetaBadges
        readingTimeMinutes={0}
        hasArticle={false}
        hasPracticeTasks={true}
        hasArticleLinks={false}
      />
    );

    expect(screen.getByText("Задачи для закрепления")).toBeInTheDocument();
  });
});
