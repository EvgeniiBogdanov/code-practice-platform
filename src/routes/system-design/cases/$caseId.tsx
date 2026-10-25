import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadDesignCase } from "@/entities/design-case";
import { loadTaskSection } from "@/entities/task/catalog";
import { DesignCasePage } from "@/pages/system-design";

const DesignCaseRoute = () => {
  const designCase = Route.useLoaderData();
  return <DesignCasePage key={designCase.id} designCase={designCase} />;
};

export const Route = createFileRoute("/system-design/cases/$caseId")({
  loader: async ({ params }) => {
    const [designCase] = await Promise.all([
      loadDesignCase(params.caseId),
      loadTaskSection("system-design"),
    ]);
    if (!designCase) throw notFound();
    return designCase;
  },
  component: DesignCaseRoute,
});
