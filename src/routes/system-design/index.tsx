import { createFileRoute } from "@tanstack/react-router";
import { DESIGN_CASES, loadDesignCase, type DesignCase } from "@/entities/design-case";
import { loadTaskSection } from "@/entities/task/catalog";
import { SystemDesignOverviewPage } from "@/pages/system-design";

const SystemDesignOverviewRoute = () => {
  const { cases } = Route.useLoaderData();
  return <SystemDesignOverviewPage cases={cases} />;
};

export const Route = createFileRoute("/system-design/")({
  loader: async (): Promise<{ cases: DesignCase[] }> => {
    const [cases] = await Promise.all([
      Promise.all(DESIGN_CASES.map(({ id }) => loadDesignCase(id))),
      loadTaskSection("system-design"),
    ]);
    return { cases: cases.flatMap((designCase) => (designCase ? [designCase] : [])) };
  },
  component: SystemDesignOverviewRoute,
});
