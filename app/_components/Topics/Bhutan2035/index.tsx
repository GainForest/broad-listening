import { Book, Calendar, MessageCircle, Users } from "lucide-react";
import TopicItem, { TClaim, TQuote, TSubtopic, TTopic } from "./ClaimTopicItem";
import parseTopics from "./utils/parse-topics";

// Function to get the base URL for API calls
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use the current origin
    return window.location.origin;
  }
  // Server-side: use environment variable or default to localhost:3000
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
};

// Function to find all author IDs within topics and subtopics
const findAuthorIdsInTopics = (topics: TTopic[]) => {
  const authorIds = new Set<string>();
  
  topics.forEach(topic => {
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
    "https://storage.googleapis.com/tttc-light-dev/7b8e53b8761a649f18f4343d0b13c34093c01957c91c72ed90f7052a04cc0b9b"
  );
  const json = await data.json();
  const topics = parseTopics(json);

  // Find all unique author IDs in the topics
  const allAuthorIds = findAuthorIdsInTopics(json.data[1].topics);
  console.log("All author IDs found:", allAuthorIds);
  console.log("Total unique authors:", allAuthorIds.length);

  // Example: Check for a specific author ID (replace with actual ID you want to check)
  // const specificAuthorId = "your-author-id-here";
  // const authorLocations = checkAuthorIdInTopics(json.data[1].topics, specificAuthorId);
  // console.log(`Author ${specificAuthorId} found in:`, authorLocations);

  // query for the demographics data
  const baseUrl = getBaseUrl();

  console.log("Base URL:", baseUrl);
  const [genderData, ageData] = await Promise.all([
    fetch(`${baseUrl}/api/profile/gender-groups`),
    fetch(`${baseUrl}/api/profile/age-groups`)
  ]);
  
  const genderJson = await genderData.json();
  const ageJson = await ageData.json();
  
  console.log("Gender groups:", genderJson);
  console.log("Age groups:", ageJson);

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
      <div className="flex flex-col border border-border rounded-xl divide-y mt-3">
        {topics.map((topic) => {
          return <TopicItem key={topic.title} data={topic} demographics={demographics} />;
        })}
      </div>
    </div>
  );
};

export default Bhutan2035;
