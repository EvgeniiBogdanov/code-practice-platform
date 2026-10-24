import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/pages/skills";
import { parseSkillsSearch } from "@/pages/skills/search";

const ReactSkillsRoute = (): React.JSX.Element => {
  const { skill, view } = Route.useSearch();
  return <SkillsPage section="react" skill={skill} view={view} />;
};

export const Route = createFileRoute("/react/skills")({
  validateSearch: parseSkillsSearch,
  component: ReactSkillsRoute,
});
