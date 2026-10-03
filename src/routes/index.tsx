import { createFileRoute, redirect } from "@tanstack/react-router";

// The public landing is a separate entry bundle (see src/main.tsx) that never mounts the router.
// Inside the workspace the root path always means the home dashboard.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/home", replace: true });
  },
});
