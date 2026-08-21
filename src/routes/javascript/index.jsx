import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/javascript/")({
  beforeLoad: () => {
    throw redirect({
      to: "/javascript/$taskId",
      params: { taskId: "group-Типы данных" },
    });
  },
});
