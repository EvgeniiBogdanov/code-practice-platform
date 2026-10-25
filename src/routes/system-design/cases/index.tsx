import { createFileRoute } from "@tanstack/react-router";
import { DESIGN_CASES, loadDesignCase, type DesignCase } from "@/entities/design-case";
import { SystemDesignFolderPage } from "@/pages/system-design";

const SystemDesignCasesRoute = () => {
  const { cases } = Route.useLoaderData();
  return <SystemDesignFolderPage folder="cases" cases={cases} />;
};

export const Route = createFileRoute("/system-design/cases/")({
  loader: async (): Promise<{ cases: DesignCase[] }> => {
    const cases = await Promise.all(DESIGN_CASES.map(({ id }) => loadDesignCase(id)));
    return { cases: cases.flatMap((designCase) => (designCase ? [designCase] : [])) };
  },
  component: SystemDesignCasesRoute,
});
