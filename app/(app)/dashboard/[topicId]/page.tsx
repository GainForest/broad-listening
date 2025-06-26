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
    "https://storage.googleapis.com/tttc-light-dev/f74c1daedd3e92cf335a0d614f88e0d929ebcd8289b6b8ca69b88b1711a58b2e"
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

  if (!topic) redirect("/not-found");

  return (
    <Container>
      <h1 className="text-3xl font-bold">{topic.title}</h1>
      <p className="text-xl text-muted-foreground">{topic.description}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">2</span>
          <span>Claims</span>
          <MessageCircle className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">12</span>
          <span>People</span>
          <User2 className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">7</span>
          <span>Subtopics</span>
          <PiTreeStructure className="size-12 absolute bottom-0 right-0 opacity-40" />
        </div>
        <div className="bg-accent rounded-lg p-2 flex flex-col text-primary relative overflow-hidden">
          <span className="text-2xl font-bold">10</span>
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
