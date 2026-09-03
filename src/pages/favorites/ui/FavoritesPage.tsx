import React from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { SECTIONS_CONFIG, SectionType } from "@/entities/task";
import { TopicIconBox } from "@/shared/ui";
import { useFavoritesPage } from "../model/use-favorites-page";
import { FavoriteTaskGallery } from "./FavoriteTaskGallery";
import { FavoriteTaskList } from "./FavoriteTaskList";
import { FavoriteTaskTree } from "./FavoriteTaskTree";
import { FavoritesToolbar } from "./FavoritesToolbar";
import styles from "./FavoritesPage.module.css";

export interface FavoritesPageProps {
  section: SectionType;
}

export const FavoritesPage = ({ section }: Readonly<FavoritesPageProps>): React.JSX.Element => {
  const state = useFavoritesPage(section);
  const sectionMeta = SECTIONS_CONFIG[section];
  const hasFavorites = state.favoriteTasks.length > 0;
  const hasFilteredTasks = state.filteredTasks.length > 0;

  return (
    <div className={styles.pageContainer}>
      <article className={styles.pageContent}>
        <header className={styles.hero}>
          <TopicIconBox colorVariant="amber" size="lg">
            <Star size={26} color="var(--accent-yellow)" fill="currentColor" />
          </TopicIconBox>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Избранное</h1>
            <p className={styles.description}>
              Важные задачи раздела {sectionMeta.title}, собранные в одном месте.
            </p>
          </div>
        </header>

        {hasFavorites ? (
          <>
            <FavoritesToolbar
              statusFilter={state.statusFilter}
              viewMode={state.viewMode}
              listDisplayMode={state.listDisplayMode}
              onStatusFilterChange={state.setStatusFilter}
              onViewModeChange={state.setViewMode}
              onListDisplayModeChange={state.setListDisplayMode}
            />
            {hasFilteredTasks ? (
              state.viewMode === "list" ? (
                state.listDisplayMode === "folders" ? (
                  <FavoriteTaskTree
                    folders={state.taskTree}
                    section={section}
                    getTaskStatus={state.getTaskStatus}
                    reviews={state.reviews}
                    excludedTaskIds={state.excludedTaskIds}
                  />
                ) : (
                  <FavoriteTaskList
                    tasks={state.filteredTasks}
                    section={section}
                    getTaskStatus={state.getTaskStatus}
                    reviews={state.reviews}
                    excludedTaskIds={state.excludedTaskIds}
                  />
                )
              ) : (
                <FavoriteTaskGallery
                  tasks={state.filteredTasks}
                  getTaskStatus={state.getTaskStatus}
                  getTaskIsDue={state.getTaskIsDue}
                  reviews={state.reviews}
                  excludedTaskIds={state.excludedTaskIds}
                />
              )
            ) : (
              <div className={styles.emptyState}>
                <h2>По выбранному фильтру задач нет</h2>
                <p>Измените фильтр, чтобы увидеть остальные избранные задачи.</p>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <Star size={34} className={styles.emptyIcon} />
            <h2>В избранном пока пусто</h2>
            <p>
              Откройте задачу и нажмите звезду в правой части заголовка — она появится здесь и в
              боковой панели.
            </p>
            <Link to={sectionMeta.path} className={styles.emptyLink}>
              Перейти к задачам
            </Link>
          </div>
        )}
      </article>
    </div>
  );
};
