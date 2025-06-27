import parseTopics from "./utils/parse-topics";
import { TopicsDisplay } from "./TopicsDisplay";
import fetchDemographics from "./utils/fetch-demographics";
import { Info } from "lucide-react";
import { TTopic } from "./TopicItem";
import { TDemographics } from "./utils/fetch-demographics";

// Function to get the base URL for API calls

// Function to find all author IDs within topics and subtopics
// const findAuthorIdsInTopics = (topics: TTopic[]) => {
//   const authorIds = new Set<string>();

//   topics.forEach((topic) => {
//     topic.subtopics.forEach((subtopic: TSubtopic) => {
//       subtopic.claims.forEach((claim: TClaim) => {
//         claim.quotes.forEach((quote: TQuote) => {
//           authorIds.add(quote.authorId);
//         });
//       });
//     });
//   });

//   return Array.from(authorIds);
// };

const Bhutan2035 = async () => {
  let topics: TTopic[] = [];
  let totalUniqueClaims = 0;
  let totalUniquePeople = 0;
  let demographics: TDemographics = {};

  try {
    const data = await fetch(
      "https://storage.googleapis.com/tttc-light-dev/f74c1daedd3e92cf335a0d614f88e0d929ebcd8289b6b8ca69b88b1711a58b2e"
    );
    
    if (!data.ok) {
      throw new Error(`Failed to fetch data: ${data.status}`);
    }
    
    const json = await data.json();
    const parsedData = parseTopics(json);
    topics = parsedData.topics;
    totalUniqueClaims = parsedData.totalUniqueClaims;
    totalUniquePeople = parsedData.totalUniquePeople;
  } catch (error) {
    console.error("Error fetching topics data:", error);
    // Fallback to empty data
  }

  try {
    demographics = await fetchDemographics();
  } catch (error) {
    console.error("Error fetching demographics:", error);
    // Fallback to empty demographics
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">Envision Bhutan 2035</h2>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xl font-bold">Summary</h3>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Info className="size-4" />
          <span>
            The summary is written by the report creators, while the rest is
            AI-generated, excluding quotes.
          </span>
        </span>
        <p className="text-justify">
          DeepGov future visioneering of a Bhutan 2035 with participants during
          the Bhutan NDI hackathon in 2025.
        </p>
      </div>
      <TopicsDisplay
        topics={topics}
        demographics={demographics}
        totalUniqueClaims={totalUniqueClaims}
        totalUniquePeople={totalUniquePeople}
      />
      ;
    </div>
  );
};

export default Bhutan2035;
