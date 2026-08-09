import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/open/")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  },
});
