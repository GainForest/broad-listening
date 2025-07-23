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
    const storageUrl = process.env.STORAGE_URL;
    if (!storageUrl) {
      throw new Error("STORAGE_URL environment variable is not set");
    }
    
    const data = await fetch(storageUrl);

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
    <div className="space-y-8">
      <header className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Envision Bhutan 2035</h1>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground/90">Summary</h2>
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
            <Info className="size-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The summary is written by the report creators, while the rest is
              AI-generated, excluding quotes.
            </p>
          </div>
          <p className="text-base leading-relaxed text-foreground/80">
            DeepGov future visioneering of a Bhutan 2035 with participants during
            the Bhutan NDI hackathon in 2025.
          </p>
        </div>
      </header>
      <TopicsDisplay
        topics={topics}
        demographics={demographics}
        totalUniqueClaims={totalUniqueClaims}
        totalUniquePeople={totalUniquePeople}
      />
    </div>
  );
};

export default Bhutan2035;
