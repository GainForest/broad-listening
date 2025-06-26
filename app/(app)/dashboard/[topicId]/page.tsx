import ClaimBoxes from "@/app/_components/Topics/Bhutan2035/ClaimBoxes";
import parseTopics from "@/app/_components/Topics/Bhutan2035/utils/parse-topics";
import Container from "@/components/ui/container";
import { redirect } from "next/navigation";
import React from "react";

const TopicPage = async ({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) => {
  const topicsPromise = fetch(
    "https://storage.googleapis.com/tttc-light-dev/f6d673c83bf46557b0a1e3401f109bb10fad76d354a4eb0af0264daf90c93ce1"
  );
  const parsedTopicsPromise = topicsPromise.then((res) => {
    return res.json().then((json) => {
      return parseTopics(json);
    });
  });
  const [paramsData, parsedTopics] = await Promise.all([
    params,
    parsedTopicsPromise,
  ]);
  const topic = parsedTopics.find((topic) => topic.id === paramsData.topicId);

  if (!topic) redirect("/not-found");

  return (
    <Container>
      <h1 className="text-3xl font-bold">{topic.title}</h1>
      <div className="mt-4">
        <ClaimBoxes data={topic} highlightedSubtopicId={null} size="lg" />
      </div>
    </Container>
  );
};

export default TopicPage;
