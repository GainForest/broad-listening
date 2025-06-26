import parseTopics from "./utils/parse-topics";
import { TopicsDisplay } from "./TopicsDisplay";

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
  const data = await fetch(
    "https://storage.googleapis.com/tttc-light-dev/f74c1daedd3e92cf335a0d614f88e0d929ebcd8289b6b8ca69b88b1711a58b2e"
  );
  const json = await data.json();
  const topics = parseTopics(json);

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

  return <TopicsDisplay topics={topics} demographics={demographics} />;
};

export default Bhutan2035;
