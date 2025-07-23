import parseTopics from "@/app/_components/Bhutan2035/utils/parse-topics";
import Container from "@/components/ui/container";
import { MessageCircle, Quote, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { PiTreeStructure } from "react-icons/pi";
import SubTopic from "./SubTopic";
import fetchDemographics from "@/app/_components/Bhutan2035/utils/fetch-demographics";

const TopicPage = async ({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) => {
  const topicsPromise = fetch(
  process.env.STORAGE_URL
  );
  const parsedTopicsPromise = topicsPromise.then((res) => {
    return res.json().then((json) => {
      return parseTopics(json);
    });
  });

  const [paramsData, parsedTopics, demographics] = await Promise.all([
    params,
    parsedTopicsPromise,
    fetchDemographics(),
  ]);
  const topic = parsedTopics.topics.find(
    (topic) => topic.id === paramsData.topicId
  );

  console.log(parsedTopics, "parsedTopics")
  if (!topic) redirect("/not-found");

  return (
    <Container>
      <h1 className="text-3xl font-bold">{topic.title}</h1>
      <p className="text-xl text-muted-foreground">{topic.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">{parsedTopics.totalUniqueClaims}</span>
          <span>Claims</span>
          <MessageCircle className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">{parsedTopics.totalUniquePeople}</span>
          <span>People</span>
          <User2 className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">{topic.subtopics.length}</span>
          <span>Subtopics</span>
          <PiTreeStructure className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">{topic.subtopics.reduce((acc, subtopic) => acc + subtopic.claims.length, 0)}</span>
          <span>Quotes</span>
          <Quote className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col gap-4">
          {topic.subtopics.map((subtopic) => (
            <SubTopic
              key={subtopic.id}
              subtopic={subtopic}
              topic={topic}
              demographics={demographics}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TopicPage;
