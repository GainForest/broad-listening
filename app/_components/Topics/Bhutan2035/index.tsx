import { Book, Calendar, MessageCircle, Users } from "lucide-react";
import TopicItem from "./ClaimTopicItem";
import parseTopics from "./utils/parse-topics";

const Bhutan2035 = async () => {
  const data = await fetch(
    "https://storage.googleapis.com/tttc-light-dev/7b8e53b8761a649f18f4343d0b13c34093c01957c91c72ed90f7052a04cc0b9b"
  );
  const json = await data.json();
  const topics = parseTopics(json);
  console.log(topics);
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
        {topics.map((topic) => {
          return <TopicItem key={topic.title} data={topic} />;
        })}
      </div>
    </div>
  );
};

export default Bhutan2035;
