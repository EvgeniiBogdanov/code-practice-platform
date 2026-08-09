import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import HomeDashboard from "../components/dashboard/HomeDashboard";
import { usePractice } from "../context/PracticeContext";

function HomePage() {
  const context = usePractice();

  return (
    <HomeDashboard
      completedTotal={context?.completedTotal}
      totalTasks={context?.totalTasks}
      completedJsTotal={context?.completedJsTotal}
      totalJsCount={context?.totalJsCount}
      completedTasks={context?.completedTasks}
    />
  );
}

export const Route = createFileRoute("/home")({
  component: HomePage,
});
