import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { getSkillById, type SkillStats } from "@/entities/skill";
import type { SectionType } from "@/entities/task/meta";
import { getRelatedSkills, getSkillGraphLayout } from "../../lib/skillGraphLayout";
import { getSkillVisual } from "../../lib/skillVisual";
import { matchesSkillFilter, type SkillFilter } from "../../model/skillFilter";
import { SkillNode } from "../SkillNode/SkillNode";
import styles from "./SkillGraph.module.css";

export interface SkillGraphProps {
  section: SectionType;
  stats: ReadonlyMap<string, SkillStats>;
  selectedId: string | null;
  filter: SkillFilter;
  onSelect: (skillId: string) => void;
  /** A click on the empty space around the cards while a skill is open. */
  onDeselect: () => void;
}

interface EdgePath {
  key: string;
  d: string;
  from: string;
  to: string;
  /** The group colour of the prerequisite the edge leads from. */
  color: string;
}

/** Route of a section: a row per prerequisite depth, curved edges from each prerequisite down. */
export const SkillGraph = memo(
  ({
    section,
    stats,
    selectedId,
    filter,
    onSelect,
    onDeselect,
  }: SkillGraphProps): React.JSX.Element => {
    const layout = useMemo(() => getSkillGraphLayout(section), [section]);
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
    const [paths, setPaths] = useState<EdgePath[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    // An edge takes the colour of the group it leads from, so the route reads by group.
    const groupColors = useMemo(
      () =>
        new Map(
          layout.levels.flat().flatMap((skillId) => {
            const skill = getSkillById(skillId);
            return skill ? [[skillId, getSkillVisual(skill).color] as const] : [];
          })
        ),
      [layout]
    );

    const activeId = hoveredId ?? selectedId;
    // A skill without links highlights nothing: muting every edge would only add noise.
    const related = useMemo(() => {
      const chain = activeId ? getRelatedSkills(activeId, layout.edges) : null;
      return chain && chain.size > 1 ? chain : null;
    }, [activeId, layout.edges]);

    // Edges follow the rendered nodes, so text wrapping and resizing never detach them.
    useLayoutEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const measure = (): void => {
        const origin = canvas.getBoundingClientRect();
        const next = layout.edges.flatMap(({ from, to }): EdgePath[] => {
          const a = nodeRefs.current.get(from)?.getBoundingClientRect();
          const b = nodeRefs.current.get(to)?.getBoundingClientRect();
          if (!a || !b) return [];
          const x1 = a.left + a.width / 2 - origin.left;
          const y1 = a.bottom - origin.top;
          const x2 = b.left + b.width / 2 - origin.left;
          const y2 = b.top - origin.top;
          const mid = (y1 + y2) / 2;
          const d = `M${x1} ${y1}C${x1} ${mid},${x2} ${mid},${x2} ${y2}`;
          const color = groupColors.get(from) ?? "";
          return [{ key: `${from}>${to}`, d, from, to, color }];
        });
        setPaths(next);
      };
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(measure);
      observer.observe(canvas);
      return () => observer.disconnect();
    }, [layout, groupColors]);

    const focusSkill = (skillId: string | undefined): void => {
      if (skillId) nodeRefs.current.get(skillId)?.focus();
    };

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>, skillId: string): void => {
        const level = layout.levels.find((ids) => ids.includes(skillId)) ?? [];
        const position = level.indexOf(skillId);
        const moves: Record<string, () => string | undefined> = {
          ArrowLeft: () => level[position - 1],
          ArrowRight: () => level[position + 1],
          ArrowUp: () => layout.edges.find((edge) => edge.to === skillId)?.from,
          ArrowDown: () => layout.edges.find((edge) => edge.from === skillId)?.to,
        };
        const move = moves[event.key];
        if (!move) return;
        event.preventDefault();
        focusSkill(move());
      },
      [layout]
    );

    const setNodeRef = (skillId: string) => (node: HTMLButtonElement | null) => {
      if (node) nodeRefs.current.set(skillId, node);
      else nodeRefs.current.delete(skillId);
    };

    // The scroller wraps the whole map, so a click anywhere off a card reaches it.
    const handleGraphClick = (event: React.MouseEvent<HTMLDivElement>): void => {
      const isCardClick =
        event.target instanceof Element && event.target.closest("[data-skill-id]") !== null;
      if (selectedId && !isCardClick) onDeselect();
    };

    return (
      <div className={styles.scroller} onClick={handleGraphClick}>
        <div ref={canvasRef} className={styles.canvas}>
          <svg className={styles.edges} aria-hidden="true">
            {paths.map((path) => (
              <path
                key={path.key}
                d={path.d}
                stroke={path.color}
                className={clsx(
                  styles.edge,
                  related?.has(path.from) && related.has(path.to) && styles.edgeActive
                )}
              />
            ))}
          </svg>
          {layout.levels.map((level, depth) => (
            <div key={depth} className={styles.level}>
              {level.map((skillId) => {
                const skill = getSkillById(skillId);
                const skillStats = stats.get(skillId);
                if (!skill || !skillStats) return null;
                return (
                  <SkillNode
                    key={skillId}
                    ref={setNodeRef(skillId)}
                    skill={skill}
                    stats={skillStats}
                    isSelected={skillId === selectedId}
                    isActive={skillId === activeId}
                    isRelated={Boolean(related?.has(skillId)) && skillId !== activeId}
                    isMuted={related !== null && !related.has(skillId)}
                    isDimmed={!matchesSkillFilter(skillStats, filter)}
                    onSelect={onSelect}
                    onHover={setHoveredId}
                    onKeyDown={handleKeyDown}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SkillGraph.displayName = "SkillGraph";
