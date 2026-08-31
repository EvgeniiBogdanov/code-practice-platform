import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UiSkeleton } from "./UiSkeleton";

describe("UiSkeleton", () => {
  it("renders with default rounded variant and shimmer animation", () => {
    const { container } = render(<UiSkeleton data-testid="test-skeleton" />);

    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton.className).toContain("variant_rounded");
    expect(skeleton.className).toContain("animation_shimmer");
  });

  it("supports text variant, custom dimensions, and radius", () => {
    const { container } = render(
      <UiSkeleton variant="text" width={200} height={20} radius={8} />
    );

    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.className).toContain("variant_text");
    expect(skeleton).toHaveStyle({
      width: "200px",
      height: "20px",
      borderRadius: "8px",
    });
  });

  it("renders circular variant", () => {
    const { container } = render(<UiSkeleton variant="circular" width={40} height={40} />);

    const skeleton = container.firstElementChild as HTMLElement;
    expect(skeleton.className).toContain("variant_circular");
    expect(skeleton).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });

  it("renders multiple lines when lines prop is provided", () => {
    const { container } = render(<UiSkeleton lines={3} />);

    const linesContainer = container.firstElementChild as HTMLElement;
    expect(linesContainer.className).toContain("linesContainer");
    expect(linesContainer.children.length).toBe(3);
  });

  it("supports pulse and none animations", () => {
    const { container: pulseContainer } = render(<UiSkeleton animation="pulse" />);
    expect((pulseContainer.firstElementChild as HTMLElement).className).toContain("animation_pulse");

    const { container: noneContainer } = render(<UiSkeleton animation="none" />);
    expect((noneContainer.firstElementChild as HTMLElement).className).toContain("animation_none");
  });
});
