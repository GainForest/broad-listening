import parseTopics from "./utils/parse-topics";
import { TopicsDisplay } from "./TopicsDisplay";
import TopicOverview from "./TopicOverview";
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

interface Bhutan2035Props {
  reportUrl: string;
}

const Bhutan2035 = async ({ reportUrl }: Bhutan2035Props) => {
  let topics: TTopic[] = [];
  let totalUniqueClaims = 0;
  let totalUniquePeople = 0;
  let title = "Broad Listening Report";
  let description = "AI-generated report based on interview data analysis.";
  let demographics: TDemographics = {};

  try {
    if (!reportUrl) {
      throw new Error("Report URL is required");
    }
    
    const data = await fetch(reportUrl);

    if (!data.ok) {
      throw new Error(`Failed to fetch data: ${data.status}`);
    }

    const json = await data.json();
    const parsedData = parseTopics(json);
    topics = parsedData.topics;
    totalUniqueClaims = parsedData.totalUniqueClaims;
    totalUniquePeople = parsedData.totalUniquePeople;
    title = parsedData.title;
    description = parsedData.description;
  } catch (error) {
    console.error("Error fetching report data:", error);
    // Fallback to empty data
  }

  try {
    demographics = await fetchDemographics();
  } catch (error) {
    console.error("Error fetching demographics:", error);
    // Fallback to empty demographics
  }

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
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
            {description}
          </p>
        </div>
      </header>
      
      <TopicOverview topics={topics} reportUrl={reportUrl} />
      
      <TopicsDisplay
        topics={topics}
        demographics={demographics}
        totalUniqueClaims={totalUniqueClaims}
        totalUniquePeople={totalUniquePeople}
        reportUrl={reportUrl}
      />
    </div>
  );
};

export default Bhutan2035;
