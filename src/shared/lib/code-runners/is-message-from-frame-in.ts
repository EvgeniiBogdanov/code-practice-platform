/** True when a postMessage came from an iframe rendered inside `container` (e.g. one tab's sandbox). */
export const isMessageFromFrameIn = (container: Element | null, event: MessageEvent): boolean =>
  container !== null &&
  Array.from(container.querySelectorAll("iframe")).some(
    (frame) => frame.contentWindow === event.source
  );
