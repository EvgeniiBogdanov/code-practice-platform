import React, { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SectionType } from "@/entities/task";
import { SquareButton, Tooltip } from "@/shared/ui";
import styles from "./SidebarFavorites.module.css";

export interface SidebarFavoritesProps {
  section: SectionType;
  currentTaskId: string;
}

const FAVORITES_ROUTES = {
  javascript: "/javascript/favorites",
  react: "/react/favorites",
  algorithms: "/algorithms/favorites",
} as const satisfies Record<SectionType, string>;

export const SidebarFavorites = React.memo(
  ({ section, currentTaskId }: Readonly<SidebarFavoritesProps>): React.JSX.Element => {
    const navigate = useNavigate();
    const handleOpenFavorites = useCallback((): void => {
      void navigate({ to: FAVORITES_ROUTES[section] });
    }, [navigate, section]);
    const isActive = currentTaskId === "favorites";

    return (
      <div className={styles.favoritesAction} aria-label="Избранные задачи">
        <div className={styles.favoritesControl}>
          <Tooltip content="Открыть избранное" side="right" sideOffset={8}>
            <SquareButton
              icon={
                <Star
                  size={16}
                  className={styles.favoriteIcon}
                  fill={isActive ? "currentColor" : "none"}
                />
              }
              size="md"
              onClick={handleOpenFavorites}
              aria-label="Открыть избранное"
              aria-current={isActive ? "page" : undefined}
              data-tree-node="true"
              isActive={isActive}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
);

SidebarFavorites.displayName = "SidebarFavorites";
