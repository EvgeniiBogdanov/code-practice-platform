import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadTaskSection } from "@/entities/task/catalog";
import { useUIStore } from "@/entities/ui-state";
import { groupAlgoTasks } from "../../lib/group-algo-tasks";
import { groupJsTasks } from "../../lib/group-js-tasks";
import { getReactCategories } from "../../lib/get-react-categories";
import { SidebarListSkeleton } from "./SidebarListSkeleton";

describe("SidebarListSkeleton", () => {
  it("renders progress card, quick actions, and default 10 folders when no section is passed", () => {
    render(<SidebarListSkeleton />);
    expect(screen.getByLabelText("Загрузка списка тем...")).toBeInTheDocument();
    expect(screen.getByLabelText("Быстрые действия")).toBeInTheDocument();

    const folders = screen.getAllByTestId("sidebar-folder-skeleton");
    expect(folders).toHaveLength(10);
  });

  it("renders 10 folders for algorithms section", () => {
    render(<SidebarListSkeleton section="algorithms" />);
    const folders = screen.getAllByTestId("sidebar-folder-skeleton");
    expect(folders).toHaveLength(10);
  });

  it("renders 11 folders for javascript section", () => {
    render(<SidebarListSkeleton section="javascript" />);
    const folders = screen.getAllByTestId("sidebar-folder-skeleton");
    expect(folders).toHaveLength(11);
  });

  it("renders 7 folders for react section", () => {
    render(<SidebarListSkeleton section="react" />);
    const folders = screen.getAllByTestId("sidebar-folder-skeleton");
    expect(folders).toHaveLength(7);
  });

  it("renders custom number of folders when foldersCount is specified", () => {
    render(<SidebarListSkeleton section="javascript" foldersCount={5} />);
    const folders = screen.getAllByTestId("sidebar-folder-skeleton");
    expect(folders).toHaveLength(5);
  });

  it("matches real section category counts from catalog", async () => {
    const algoTasks = await loadTaskSection("algorithms");
    const { groupedTasks: algoGroups } = groupAlgoTasks(algoTasks);
    expect(Object.keys(algoGroups)).toHaveLength(10);

    const jsTasks = await loadTaskSection("javascript");
    const { groupedTasks: jsGroups } = groupJsTasks(jsTasks);
    expect(Object.keys(jsGroups)).toHaveLength(11);

    const reactTasks = await loadTaskSection("react");
    const reactCats = getReactCategories(useUIStore.getState(), reactTasks);
    expect(reactCats).toHaveLength(7);
  });
});
