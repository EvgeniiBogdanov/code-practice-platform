import { useState, useEffect, useRef } from "react";

export function useAccordionState(
  controlledIsOpen?: boolean,
  defaultOpen = false,
  onToggle?: () => void
) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const isInitialMount = useRef(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setHasInteracted(true);
  }, [isOpen]);

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
