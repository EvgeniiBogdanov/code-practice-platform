import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/pages/skills";
import { parseSkillsSearch } from "@/pages/skills/search";

const TypescriptSkillsRoute = (): React.JSX.Element => {
  const { skill, view } = Route.useSearch();
  return <SkillsPage section="typescript" skill={skill} view={view} />;
};

export const Route = createFileRoute("/typescript/skills")({
  validateSearch: parseSkillsSearch,
  component: TypescriptSkillsRoute,
});
