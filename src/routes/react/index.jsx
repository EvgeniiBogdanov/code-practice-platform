import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/react/")({
  beforeLoad: () => {
    throw redirect({
      to: "/react/$taskId",
      params: { taskId: "group-warmup" },
    });
  },
});
