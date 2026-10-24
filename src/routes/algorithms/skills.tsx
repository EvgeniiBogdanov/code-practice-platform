import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/pages/skills";
import { parseSkillsSearch } from "@/pages/skills/search";

const AlgorithmsSkillsRoute = (): React.JSX.Element => {
  const { skill, view } = Route.useSearch();
  return <SkillsPage section="algorithms" skill={skill} view={view} />;
};

export const Route = createFileRoute("/algorithms/skills")({
  validateSearch: parseSkillsSearch,
  component: AlgorithmsSkillsRoute,
});
