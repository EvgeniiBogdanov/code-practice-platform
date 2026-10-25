import { createFileRoute, notFound } from "@tanstack/react-router";
import { getDesignTopic, loadDesignTopicArticle } from "@/entities/design-topic";
import { DesignTopicPage } from "@/pages/system-design";

const DesignTopicRoute = () => {
  const { topic, article } = Route.useLoaderData();
  return <DesignTopicPage topic={topic} article={article} />;
};

export const Route = createFileRoute("/system-design/topics/$topicId")({
  loader: async ({ params }) => {
    const topic = getDesignTopic(params.topicId);
    const article = topic ? await loadDesignTopicArticle(topic.id) : null;
    if (!topic || article === null) throw notFound();
    return { topic, article };
  },
  component: DesignTopicRoute,
});
