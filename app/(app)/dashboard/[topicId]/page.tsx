import ClaimBoxes from "@/app/_components/Topics/Bhutan2035/ClaimBoxes";
import parseTopics from "@/app/_components/Topics/Bhutan2035/utils/parse-topics";
import Container from "@/components/ui/container";
import { MessageCircle, Quote, User2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { PiTreeStructure } from "react-icons/pi";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  // Server-side: use environment variable or default to localhost:3000
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

const baseUrl = getBaseUrl();

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

  const [paramsData, parsedTopics, genderData, ageData] = await Promise.all([
    params,
    parsedTopicsPromise,
    fetch(`${baseUrl}/api/profile/gender-groups`),
    fetch(`${baseUrl}/api/profile/age-groups`),
  ]);
  const topic = parsedTopics.find((topic) => topic.id === paramsData.topicId);

  const genderJson = await genderData.json();
  const ageJson = await ageData.json();

  const demographics = {
    gender: genderJson,
    age: ageJson,
  };

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
            <div key={subtopic.id}>
              <h3 className="text-xl font-bold">{subtopic.title}</h3>
              <p>{subtopic.description}</p>

              <div className="mt-2">
                <ClaimBoxes
                  data={{
                    title: topic.title,
                    id: topic.id,
                    description: topic.description,
                    subtopics: [subtopic],
                    colorIndex: topic.colorIndex,
                    totalPeople: topic.totalPeople,
                    totalClaims: topic.totalClaims,
                  }}
                  highlightedSubtopicId={null}
                  size="lg"
                  demographics={demographics}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TopicPage;
