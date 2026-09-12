import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TracePlayback } from "../model/use-trace-playback";
import { TraceControls } from "./TraceControls";

const createMockPlayback = (overrides?: Partial<TracePlayback>): TracePlayback => ({
  index: 0,
  playing: false,
  speed: 1,
  reducedMotion: false,
  toggle: vi.fn(),
  seek: vi.fn(),
  setSpeed: vi.fn(),
  ...overrides,
});

describe("TraceControls", () => {
  it("renders speed selector with current speed and triggers setSpeed on change", () => {
    const playback = createMockPlayback({ speed: 1.5 });
    render(<TraceControls playback={playback} length={10} />);

    const speedSelect = screen.getByRole("combobox", { name: "Скорость воспроизведения" });
    expect(speedSelect).toBeInTheDocument();
    expect(speedSelect).toHaveValue("1.5");

    fireEvent.change(speedSelect, { target: { value: "2" } });
    expect(playback.setSpeed).toHaveBeenCalledWith(2);
  });

  it("renders timeline range and step indicator", () => {
    const playback = createMockPlayback({ index: 3 });
    render(<TraceControls playback={playback} length={10} />);

    const slider = screen.getByRole("slider", { name: "Шаг алгоритма" });
    expect(slider).toHaveValue("3");
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("/ 10")).toBeInTheDocument();
  });
});
