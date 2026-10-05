import { useEffect, RefObject } from "react";

export const useSidebarKeyboardNav = (containerRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isItemVisible = (el: HTMLElement): boolean => {
      if (el.hidden || el.style.display === "none" || el.style.visibility === "hidden") {
        return false;
      }
      // Walk up parents to container: if any taskListWrapper has data-expanded !== "true", it is hidden!
      let current: HTMLElement | null = el.parentElement;
      while (current && current !== container) {
        if (
          current.getAttribute("data-task-list-wrapper") === "true" ||
          current.classList.contains("taskListWrapper") ||
          Array.from(current.classList).some((cls) => cls.includes("taskListWrapper"))
        ) {
          const isExp =
            current.getAttribute("data-expanded") === "true" ||
            Array.from(current.classList).some((cls) => cls.includes("expanded"));
          if (!isExp) {
            return false;
          }
        }
        current = current.parentElement;
      }
      return true;
    };

    const getVisibleTreeItems = (): HTMLElement[] => {
      const allHeaders = Array.from(
        container.querySelectorAll<HTMLElement>(
          '[data-tree-node="true"], a[class*="treeNodeHeader"], button[class*="treeNodeHeader"], div[class*="treeNodeHeader"]'
        )
      );
      return allHeaders.filter(isItemVisible);
    };

    const focusItem = (item: HTMLElement | undefined) => {
      if (!item) return;
      item.focus();
      item.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (!activeEl) return;

      // Don't intercept if focus is inside an input/textarea
      if (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") return;

      // Find if active element is a tree row or inside container
      const currentItem = activeEl.closest<HTMLElement>(
        '[data-tree-node="true"], a[class*="treeNodeHeader"], button[class*="treeNodeHeader"], div[class*="treeNodeHeader"]'
      );

      const isInsideContainer = container.contains(activeEl);
      if (!isInsideContainer && !currentItem) return;

      const items = getVisibleTreeItems();
      if (items.length === 0) return;

      const currentIndex = currentItem ? items.indexOf(currentItem) : -1;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (currentIndex === -1 || currentIndex === items.length - 1) {
            focusItem(items[0]);
          } else {
            focusItem(items[currentIndex + 1]);
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          if (currentIndex === -1 || currentIndex === 0) {
            focusItem(items[items.length - 1]);
          } else {
            focusItem(items[currentIndex - 1]);
          }
          break;
        }

        case "Home": {
          e.preventDefault();
          focusItem(items[0]);
          break;
        }

        case "End": {
          e.preventDefault();
          focusItem(items[items.length - 1]);
          break;
        }

        case "ArrowRight": {
          if (!currentItem) return;
          const toggleBtn = currentItem.querySelector<HTMLElement>(
            '[data-toggle-btn="true"], [class*="toggleWrapper"]'
          );
          if (toggleBtn) {
            e.preventDefault();
            const isExpanded = toggleBtn.getAttribute("data-expanded") === "true";

            if (!isExpanded) {
              // Closed folder -> Expand it
              toggleBtn.click();
            } else if (currentIndex !== -1 && currentIndex < items.length - 1) {
              // Already open folder -> Move focus to first visible child
              focusItem(items[currentIndex + 1]);
            }
          }
          break;
        }

        case "ArrowLeft": {
          if (!currentItem) return;
          const toggleBtn = currentItem.querySelector<HTMLElement>(
            '[data-toggle-btn="true"], [class*="toggleWrapper"]'
          );
          const isExpanded = toggleBtn?.getAttribute("data-expanded") === "true";

          if (toggleBtn && isExpanded) {
            // Open folder -> Collapse it
            e.preventDefault();
            toggleBtn.click();
          } else {
            // Task or closed folder -> Move focus to parent folder
            let parentWrapper: HTMLElement | null = currentItem.parentElement;
            while (parentWrapper && parentWrapper !== container) {
              if (
                parentWrapper.getAttribute("data-task-list-wrapper") === "true" ||
                parentWrapper.classList.contains("taskListWrapper") ||
                Array.from(parentWrapper.classList).some((cls) => cls.includes("taskListWrapper"))
              ) {
                break;
              }
              parentWrapper = parentWrapper.parentElement;
            }

            if (parentWrapper && parentWrapper !== container) {
              const parentBlock = parentWrapper.parentElement;
              const parentHeader = parentBlock?.querySelector<HTMLElement>(
                '[data-tree-node="true"], a[class*="treeNodeHeader"], button[class*="treeNodeHeader"], div[class*="treeNodeHeader"]'
              );
              if (parentHeader && parentHeader !== currentItem) {
                e.preventDefault();
                focusItem(parentHeader);
                return;
              }
            }
          }
          break;
        }
      }
    };

    const handleFocus = (e: FocusEvent) => {
      if (e.target === container) {
        const items = getVisibleTreeItems();
        const activeItem = items.find(
          (el) =>
            el.classList.contains("active") ||
            Array.from(el.classList).some(
              (cls) => cls.includes("active") || cls.includes("isActive")
            )
        );
        focusItem(activeItem || items[0]);
      }
    };

    container.addEventListener("focus", handleFocus);
    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("focus", handleFocus);
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef]);
};
