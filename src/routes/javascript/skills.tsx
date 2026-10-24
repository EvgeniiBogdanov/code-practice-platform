import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SkillsPage } from "@/pages/skills";
import { parseSkillsSearch } from "@/pages/skills/search";

const JavascriptSkillsRoute = (): React.JSX.Element => {
  const { skill, view } = Route.useSearch();
  return <SkillsPage section="javascript" skill={skill} view={view} />;
};

export const Route = createFileRoute("/javascript/skills")({
  validateSearch: parseSkillsSearch,
  component: JavascriptSkillsRoute,
});
