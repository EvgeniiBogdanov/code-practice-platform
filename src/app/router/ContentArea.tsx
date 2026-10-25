import React from "react";
import { ScrollEdgeFade } from "@/shared/ui";

export interface ContentAreaProps {
  ref: React.Ref<HTMLElement>;
  className?: string;
  children: React.ReactNode;
}

/** The page scroller: its top edge fades out the content that scrolls under the app header. */
export const ContentArea = ({ ref, className, children }: ContentAreaProps): React.JSX.Element => (
  <main ref={ref} className={className}>
    <ScrollEdgeFade />
    {children}
  </main>
);
