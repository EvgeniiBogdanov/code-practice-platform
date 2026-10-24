import React, { useState } from "react";
import { ScrollEdgeFade } from "@/shared/ui";

export interface ContentAreaProps {
  ref: React.Ref<HTMLElement>;
  className?: string;
  children: React.ReactNode;
}

/** The page scroller: a soft edge appears under the app header once the page scrolls. */
export const ContentArea = ({ ref, className, children }: ContentAreaProps): React.JSX.Element => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <main
      ref={ref}
      className={className}
      onScroll={(event): void => setIsScrolled(event.currentTarget.scrollTop > 0)}
    >
      <ScrollEdgeFade isVisible={isScrolled} />
      {children}
    </main>
  );
};
