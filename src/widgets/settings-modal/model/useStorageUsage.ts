import { useEffect, useState } from "react";
import { getStorageEstimate } from "@/shared/lib/storage";

const KB_IN_MB = 1024;

/** `0.42` → "430 КБ", `3.5` → "3.5 МБ". */
export const formatStorageSize = (megabytes: number): string =>
  megabytes < 1 ? `${Math.round(megabytes * KB_IN_MB)} КБ` : `${megabytes} МБ`;

/** Browser-reported size of this origin's storage (IndexedDB included), or `null` while unknown. */
export const useStorageUsage = (): string | null => {
  const [usage, setUsage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    void getStorageEstimate().then(({ usageMB, quotaMB }) => {
      if (isActive && quotaMB > 0) setUsage(formatStorageSize(usageMB));
    });
    return () => {
      isActive = false;
    };
  }, []);

  return usage;
};
