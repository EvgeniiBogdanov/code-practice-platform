import { useState, useEffect } from "react";

export function useAccordionState(
  controlledIsOpen?: boolean,
  defaultOpen = false,
  onToggle?: () => void
) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setHasInteracted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
    if (!isControlled) {
      setUncontrolledIsOpen((prev) => !prev);
    }
  };

  return {
    isOpen,
    hasInteracted,
    handleToggle,
  };
}
