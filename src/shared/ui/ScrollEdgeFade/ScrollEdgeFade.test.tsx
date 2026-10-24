import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollEdgeFade } from "./ScrollEdgeFade";
import styles from "./ScrollEdgeFade.module.css";

describe("ScrollEdgeFade", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<ScrollEdgeFade isVisible={false} />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("fades in only while visible", () => {
    const { container, rerender } = render(<ScrollEdgeFade isVisible={false} />);
    const fade = container.firstElementChild;

    expect(fade).toHaveClass(styles.edgeFade);
    expect(fade).not.toHaveClass(styles.edgeFadeVisible);

    rerender(<ScrollEdgeFade isVisible={true} />);

    expect(fade).toHaveClass(styles.edgeFadeVisible);
  });
});
