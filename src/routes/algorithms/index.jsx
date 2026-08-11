import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/algorithms/")({
  beforeLoad: () => {
    throw redirect({
      to: "/algorithms/$taskId",
      params: { taskId: "group-two-pointers" },
    });
  },
});
