import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskTabSkeleton } from "./TaskTabSkeleton";

describe("TaskTabSkeleton", () => {
  it("renders candidate tab skeleton by default", () => {
    const { container } = render(<TaskTabSkeleton tab="candidate" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders solution tab skeleton for solution tab", () => {
    const { container } = render(<TaskTabSkeleton tab="solution" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders materials tab skeleton for materials tab", () => {
    const { container } = render(<TaskTabSkeleton tab="materials" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders questions tab skeleton for questions tab", () => {
    const { container } = render(<TaskTabSkeleton tab="questions" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders checklist tab skeleton for checklist tab", () => {
    const { container } = render(<TaskTabSkeleton tab="checklist" />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });
});
