import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentArea } from "./ContentArea";

describe("ContentArea", () => {
  it("keeps the edge fade hidden while the page is at the top", () => {
    render(
      <ContentArea ref={createRef<HTMLElement>()}>
        <p>Page</p>
      </ContentArea>
    );

    const fade = screen.getByText("Page").previousElementSibling;

    expect(fade).toHaveAttribute("aria-hidden", "true");
    expect(fade?.className).not.toMatch(/edgeFadeVisible/);
  });

  it("shows the edge fade once the page is scrolled", () => {
    render(
      <ContentArea ref={createRef<HTMLElement>()}>
        <p>Page</p>
      </ContentArea>
    );
    const main = screen.getByText("Page").parentElement as HTMLElement;

    fireEvent.scroll(main, { target: { scrollTop: 120 } });

    expect(main.firstElementChild?.className).toMatch(/edgeFadeVisible/);
  });
});
