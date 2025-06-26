import { Book, Calendar, MessageCircle, Users } from "lucide-react";
import TopicItem, { TClaim, TDemographics, TQuote, TSubtopic, TTopic } from "./ClaimTopicItem";
import parseTopics from "./utils/parse-topics";
import { DisplayTopicsOrDemographics } from "./Display";

// Function to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  // Server-side: use environment variable or default to localhost:3000
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

// Function to find all author IDs within topics and subtopics
const findAuthorIdsInTopics = (topics: TTopic[]) => {
  const authorIds = new Set<string>();

  topics.forEach((topic) => {
    topic.subtopics.forEach((subtopic: TSubtopic) => {
      subtopic.claims.forEach((claim: TClaim) => {
        claim.quotes.forEach((quote: TQuote) => {
          authorIds.add(quote.authorId);
        });
      });
    });
  });

  return Array.from(authorIds);
};

const Bhutan2035 = async () => {
  const data = await fetch(
    "https://storage.googleapis.com/tttc-light-dev/f6d673c83bf46557b0a1e3401f109bb10fad76d354a4eb0af0264daf90c93ce1"
  );
  const json = await data.json();
  const topics = parseTopics(json);

  // Example: Check for a specific author ID (replace with actual ID you want to check)
  // const specificAuthorId = "your-author-id-here";
  // const authorLocations = checkAuthorIdInTopics(json.data[1].topics, specificAuthorId);
  // console.log(`Author ${specificAuthorId} found in:`, authorLocations);

  // query for the demographics data
  const baseUrl = getBaseUrl();

  const [genderData, ageData] = await Promise.all([
    fetch(`${baseUrl}/api/profile/gender-groups`),
    fetch(`${baseUrl}/api/profile/age-groups`),
  ]);

  const genderJson = await genderData.json();
  const ageJson = await ageData.json();

  const demographics = {
    gender: genderJson,
    age: ageJson,
  };

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
      <DisplayTopicsOrDemographics topics={topics} demographics={demographics}/>
    </div>
  );
};

export default Bhutan2035;
