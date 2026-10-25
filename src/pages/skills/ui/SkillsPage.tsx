import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Info, Waypoints } from "lucide-react";
import {
  SkillDetailPanel,
  SkillFocusList,
  SkillGraph,
  SkillList,
  SkillMiniPanel,
  getSkillFocus,
  useSkillPanelStore,
  useSkillStats,
} from "@/features/skill-map";
import {
  SKILL_MAP_ROUTES,
  formatSkillPercent,
  getSectionSummary,
  getSkillById,
  type SkillSection,
} from "@/entities/skill";
import { SECTIONS_CONFIG } from "@/entities/task/meta";
import { Badge, Card, Tooltip, TopicIconBox } from "@/shared/ui";
import { useSkillMapPrefsStore } from "../model/skillMapPrefsStore";
import type { SkillMapView, SkillsSearch } from "../model/skillsSearch";
import { SkillsToolbar } from "./SkillsToolbar";
import styles from "./SkillsPage.module.css";

/** Panel and graph sit side by side from this width; below it the panel follows the graph. */
const NARROW_QUERY = "(max-width: 767px)";

const matchesMedia = (query: string): boolean =>
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;

export interface SkillsPageProps extends SkillsSearch {
  /** The map lives inside a section, like its favorites. */
  section: SkillSection;
}

export const SkillsPage = ({ section, skill, view }: SkillsPageProps): React.JSX.Element => {
  const navigate = useNavigate();
  const stats = useSkillStats();
  const [narrowDefault] = useState(() => matchesMedia(NARROW_QUERY));
  const isCollapsed = useSkillPanelStore((state) => state.isCollapsed);
  const setCollapsed = useSkillPanelStore((state) => state.setCollapsed);
  const filter = useSkillMapPrefsStore((state) => state.filter);
  const setFilter = useSkillMapPrefsStore((state) => state.setFilter);
  const savedView = useSkillMapPrefsStore((state) => state.view);
  const setSavedView = useSkillMapPrefsStore((state) => state.setView);

  // The address wins for a shared link; otherwise the view the user picked last, then the screen width.
  const activeView: SkillMapView = view ?? savedView ?? (narrowDefault ? "list" : "graph");
  const focus = useMemo(() => getSkillFocus(stats, { limit: 3, section }), [stats, section]);
  // The drawer opens for an explicitly chosen skill only; the graph stays whole until then.
  const selectedId = skill && getSkillById(skill)?.section === section ? skill : null;

  const summary = getSectionSummary(stats, section);
  const readiness = formatSkillPercent(summary.readiness);
  const hasWeak = focus.some((item) => item.kind === "weak");

  const updateSearch = (next: SkillsSearch): void => {
    void navigate({
      to: SKILL_MAP_ROUTES[section],
      search: { skill, view, ...next },
      replace: true,
      resetScroll: false,
    });
  };

  // The choice is kept for the next visit and mirrored in the address, so the link opens the same view.
  const changeView = (next: SkillMapView): void => {
    setSavedView(next);
    updateSearch({ view: next });
  };

  const closePanel = useCallback((): void => {
    void navigate({
      to: SKILL_MAP_ROUTES[section],
      search: { skill: undefined, view },
      replace: true,
      resetScroll: false,
    });
  }, [navigate, section, view]);

  // Subscribed only while a skill is open, and not re-subscribed on every render.
  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId, closePanel]);

  const selectSkill = (skillId: string): void => {
    // A second click on the open skill puts the map back as it was before the first click.
    if (skillId === selectedId) {
      closePanel();
      return;
    }
    const target = getSkillById(skillId)?.section ?? section;
    // A prerequisite from another section opens that section's map, keeping the view.
    if (target !== section) {
      void navigate({ to: SKILL_MAP_ROUTES[target], search: { skill: skillId, view } });
      return;
    }
    updateSearch({ skill: skillId });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <TopicIconBox colorVariant="blue" size="md">
            <Waypoints size={18} />
          </TopicIconBox>
          <h1 className={styles.title}>Карта навыков</h1>
          <Badge variant="gray" size="md" uppercase={false}>
            {SECTIONS_CONFIG[section].title}
          </Badge>
        </div>
        <p className={styles.subtitle}>
          Освоение тем по решениям, оценкам и повторениям: где вы сильны, что подтянуть и куда идти
          дальше по маршруту.
        </p>
      </header>

      <div className={styles.kpis}>
        <Card className={styles.kpi}>
          <span className={styles.kpiLabel}>
            Готовность к собеседованию
            <Tooltip
              content="Освоение навыков раздела, взвешенное по вероятности встретить их задачи на собеседовании"
              side="bottom"
            >
              <button type="button" className={styles.info} aria-label="Как считается готовность">
                <Info size={13} aria-hidden="true" />
              </button>
            </Tooltip>
          </span>
          <span className={styles.kpiValue}>{readiness}%</span>
        </Card>
        <Card className={styles.kpi}>
          <span className={styles.kpiLabel}>Слабые места</span>
          <span className={styles.kpiValue}>
            {summary.weakCount}
            <span className={styles.kpiTotal}> из {summary.total}</span>
          </span>
        </Card>
        <Card className={styles.kpi}>
          <span className={styles.kpiLabel}>Угасает</span>
          <span className={styles.kpiValue}>{summary.fadingCount}</span>
        </Card>
      </div>

      {focus.length > 0 && (
        <section className={styles.block} aria-labelledby="skills-focus-title">
          <h2 id="skills-focus-title" className={styles.blockTitle}>
            {hasWeak ? "Подтянуть сейчас" : "Следующий шаг"}
          </h2>
          <SkillFocusList items={focus} stats={stats} variant="rows" onSelectSkill={selectSkill} />
        </section>
      )}

      <section className={styles.block} aria-labelledby="skills-route-title">
        <div className={styles.routeHeader}>
          <h2 id="skills-route-title" className={styles.blockTitle}>
            Маршрут {SECTIONS_CONFIG[section].title}
          </h2>
        </div>

        <SkillsToolbar
          filter={filter}
          onFilterChange={setFilter}
          view={activeView}
          onViewChange={changeView}
        />

        {activeView === "graph" ? (
          <SkillGraph
            section={section}
            stats={stats}
            selectedId={selectedId}
            filter={filter}
            onSelect={selectSkill}
            onDeselect={closePanel}
          />
        ) : (
          <SkillList
            section={section}
            stats={stats}
            selectedId={selectedId}
            filter={filter}
            onSelect={selectSkill}
          />
        )}
        {selectedId && (
          <aside
            className={isCollapsed ? styles.miniDrawer : styles.drawer}
            aria-label="Выбранный навык"
          >
            {isCollapsed ? (
              <SkillMiniPanel
                skillId={selectedId}
                stats={stats}
                onExpand={(): void => setCollapsed(false)}
              />
            ) : (
              <SkillDetailPanel
                skillId={selectedId}
                stats={stats}
                onSelectSkill={selectSkill}
                onCollapse={(): void => setCollapsed(true)}
              />
            )}
          </aside>
        )}
      </section>
    </div>
  );
};
