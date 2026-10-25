import React from "react";
import { clsx } from "clsx";
import { BookOpen, ClipboardList, Code2, FileCode2, FileText, Layers } from "lucide-react";
import { DESIGN_CASES } from "@/entities/design-case";
import { DESIGN_TOPICS } from "@/entities/design-topic";
import { getTaskRoute } from "@/entities/task";
import { TaskListWrapper } from "@/shared/ui";
import { useSidebarSystemDesignList } from "../model";
import { SidebarProgressCard } from "./SidebarProgressCard/SidebarProgressCard";
import { SidebarQuickActions } from "./SidebarQuickActions";
import { SidebarSystemDesignGroup } from "./SidebarSystemDesignGroup";
import { SidebarTaskItem } from "./SidebarTaskItem";
import { SidebarTasksList } from "./SidebarTasksList";
import styles from "./SidebarSystemDesignList.module.css";

export interface SidebarSystemDesignListProps {
  className?: string;
}

const PAGE_ICON_SIZE = 16;

export const SidebarSystemDesignList = ({
  className,
}: SidebarSystemDesignListProps): React.JSX.Element => {
  const {
    currentTaskId,
    decodedCurrentId,
    pathname,
    drills,
    completedTasks,
    reviews,
    completedTotal,
    totalCount,
    isGroupOpen,
    toggleGroup,
  } = useSidebarSystemDesignList();

  return (
    <div className={clsx(styles.listContainer, className)}>
      <SidebarProgressCard
        completedCount={completedTotal}
        totalCount={totalCount}
        sectionType="system-design"
      >
        <SidebarQuickActions section="system-design" currentTaskId={currentTaskId} />
      </SidebarProgressCard>

      {DESIGN_TOPICS.length > 0 && (
        <SidebarSystemDesignGroup
          to="/system-design/topics"
          isActive={pathname === "/system-design/topics"}
          title="Теория"
          icon={<BookOpen size={17} className={styles.iconTheory} />}
          isOpen={isGroupOpen("theory")}
          onToggle={() => toggleGroup("theory")}
          completedCount={0}
          totalCount={DESIGN_TOPICS.length}
          countVariant="count"
        >
          <TaskListWrapper expanded={isGroupOpen("theory")} isSubgroup={false}>
            {DESIGN_TOPICS.map((topic) => (
              <SidebarTaskItem
                key={topic.id}
                id={`topic-${topic.id}`}
                to="/system-design/topics/$topicId"
                params={{ topicId: topic.id }}
                title={topic.title}
                isActive={pathname === `/system-design/topics/${topic.id}`}
                isSolved={false}
                isUnsolved={false}
                isDue={false}
                icon={<FileText size={PAGE_ICON_SIZE} className={styles.iconPage} />}
              />
            ))}
          </TaskListWrapper>
        </SidebarSystemDesignGroup>
      )}

      {DESIGN_CASES.length > 0 && (
        <SidebarSystemDesignGroup
          to="/system-design/cases"
          isActive={pathname === "/system-design/cases"}
          title="Кейсы"
          icon={<Layers size={17} className={styles.iconCases} />}
          isOpen={isGroupOpen("cases")}
          onToggle={() => toggleGroup("cases")}
          completedCount={0}
          totalCount={DESIGN_CASES.length}
          countVariant="count"
        >
          <TaskListWrapper expanded={isGroupOpen("cases")} isSubgroup={false}>
            {DESIGN_CASES.map((designCase) => (
              <SidebarTaskItem
                key={designCase.id}
                id={`case-${designCase.id}`}
                to="/system-design/cases/$caseId"
                params={{ caseId: designCase.id }}
                title={designCase.title}
                isActive={pathname === `/system-design/cases/${designCase.id}`}
                isSolved={false}
                isUnsolved={false}
                isDue={false}
                icon={<ClipboardList size={PAGE_ICON_SIZE} className={styles.iconPage} />}
              />
            ))}
          </TaskListWrapper>
        </SidebarSystemDesignGroup>
      )}

      {drills.length > 0 && (
        <SidebarSystemDesignGroup
          to="/system-design/drills"
          isActive={pathname === "/system-design/drills"}
          title="Дриллы"
          icon={<Code2 size={17} className={styles.iconDrills} />}
          isOpen={isGroupOpen("drills")}
          onToggle={() => toggleGroup("drills")}
          completedCount={completedTotal}
          totalCount={totalCount}
        >
          <SidebarTasksList
            tasks={drills}
            to={getTaskRoute({ section: "system-design" })}
            currentTaskId={decodedCurrentId}
            completedTasks={completedTasks}
            reviews={reviews}
            expanded={isGroupOpen("drills")}
            icon={<FileCode2 size={PAGE_ICON_SIZE} className={styles.iconPage} />}
          />
        </SidebarSystemDesignGroup>
      )}
    </div>
  );
};

SidebarSystemDesignList.displayName = "SidebarSystemDesignList";
