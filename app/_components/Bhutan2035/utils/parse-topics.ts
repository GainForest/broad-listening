/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTopic } from "../TopicItem";
export const TopicColors = [
  [185, 28, 28], // red-700
  [194, 65, 12], // orange-700
  [180, 83, 9], // amber-700
  [161, 98, 7], // yellow-700
  [101, 163, 13], // lime-700
  [21, 128, 61], // green-700
  [4, 120, 87], // emerald-700
  [15, 118, 110], // teal-700
  [14, 116, 144], // cyan-700
  [2, 132, 199], // sky-700
  [29, 78, 216], // blue-700
  [67, 56, 202], // indigo-700
  [109, 40, 217], // violet-700
  [126, 34, 206], // purple-700
  [192, 38, 211], // fuchsia-700
  [190, 24, 93], // pink-700
  [190, 18, 60], // rose-700
];

const parseTopics = (
  data: any
): {
  topics: TTopic[];
  totalUniqueClaims: number;
  totalUniquePeople: number;
} => {
  const claimIdToIndexMappings: Map<string, number> = new Map();
  const userIdToIndexMappings: Map<string, number> = new Map();
  const topics = data.data[1].topics;
  const result = topics.map((topic: any) => {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      colorIndex: topic.title.length % TopicColors.length,
      subtopics: topic.subtopics.map((subtopic: any) => {
        return {
          id: subtopic.id,
          title: subtopic.title,
          description: subtopic.description,
          claims: subtopic.claims.map((claim: any) => {
            claimIdToIndexMappings.set(
              claim.id,
              claimIdToIndexMappings.get(claim.id) ??
                claimIdToIndexMappings.size + 1
            );
            return {
              index: claimIdToIndexMappings.get(claim.id),
              id: claim.id,
              content: claim.title,
              quotes: claim.quotes.map((quote: any) => {
                userIdToIndexMappings.set(
                  quote.reference.interview,
                  userIdToIndexMappings.get(quote.reference.interview) ??
                    userIdToIndexMappings.size + 1
                );
                return {
                  id: quote.id,
                  text: quote.text,
                  authorId: quote.reference.interview,
                  authorIndex:
                    userIdToIndexMappings.get(quote.reference.interview) ??
                    userIdToIndexMappings.size + 1,
                };
              }),
            };
          }),
        };
      }),
    };
  });

  return {
    topics: result,
    totalUniqueClaims: claimIdToIndexMappings.size,
    totalUniquePeople: userIdToIndexMappings.size,
  };
};

export default parseTopics;
