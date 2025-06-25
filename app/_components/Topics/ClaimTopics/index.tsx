import { Book, Calendar, MessageCircle, Users } from "lucide-react";
import ClaimTopicItem from "./ClaimTopicItem";

const claimTopics = [
  {
    title: "Topic 1",
    claims: 10,
    people: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    subtopics: [
      {
        title: "Subtopic 1",
      },
      {
        title: "Subtopic 2",
      },
      {
        title: "Subtopic 3",
      },
    ],
  },
  {
    title: "Topic 2",
    claims: 10,
    people: 10,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    subtopics: [
      {
        title: "Subtopic 1",
      },
      {
        title: "Subtopic 2",
      },
      {
        title: "Subtopic 3",
      },
      {
        title: "Subtopic 4",
      },
      {
        title: "Subtopic 5",
      },
    ],
  },
];

const ClaimTopics = () => {
  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-xl font-bold">Claims</h3>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Book className="size-4" />
          10 Topics
        </span>
        <div className="h-4 w-0.5 bg-muted"></div>
        <span className="flex items-center gap-1">
          <MessageCircle className="size-4" />
          1000+ claims
        </span>
        <div className="h-4 w-0.5 bg-muted"></div>
        <span className="flex items-center gap-1">
          <Users className="size-4" />
          641 People
        </span>
        <div className="h-4 w-0.5 bg-muted"></div>
        <span className="flex items-center gap-1">
          <Calendar className="size-4" />
          Feb 9, 2025
        </span>
      </div>
      <div className="flex flex-col border border-border rounded-xl divide-y mt-3">
        {claimTopics.map((topic) => {
          return <ClaimTopicItem key={topic.title} data={topic} />;
        })}
      </div>
    </div>
  );
};

export default ClaimTopics;
