import { useCallback, type JSX } from "react";
import { Maximize2, Minimize2, Scan, ZoomIn, ZoomOut } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Button } from "../Button";
import { FIT_VIEW_OPTIONS } from "./boardModel";

const ZOOM_OPTIONS = { duration: 150 };
const ICON_SIZE = 16;

interface BoardViewControlsProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

/** Zoom, «show all» and fullscreen: the part of the toolbar the editor and the viewer share. */
export const BoardViewControls = ({
  isFullscreen,
  onToggleFullscreen,
}: BoardViewControlsProps): JSX.Element => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const fullscreenLabel = isFullscreen ? "Свернуть" : "На весь экран";

  const showAll = useCallback((): void => {
    void fitView(FIT_VIEW_OPTIONS);
  }, [fitView]);

  const handleZoomIn = useCallback((): void => {
    void zoomIn(ZOOM_OPTIONS);
  }, [zoomIn]);

  const handleZoomOut = useCallback((): void => {
    void zoomOut(ZOOM_OPTIONS);
  }, [zoomOut]);

  return (
    <>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Уменьшить"
        title="Уменьшить"
        onClick={handleZoomOut}
      >
        <ZoomOut size={ICON_SIZE} />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Увеличить"
        title="Увеличить"
        onClick={handleZoomIn}
      >
        <ZoomIn size={ICON_SIZE} />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label="Показать всё"
        title="Показать всё"
        onClick={showAll}
      >
        <Scan size={ICON_SIZE} />
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={fullscreenLabel}
        title={fullscreenLabel}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? <Minimize2 size={ICON_SIZE} /> : <Maximize2 size={ICON_SIZE} />}
      </Button>
    </>
  );
};
