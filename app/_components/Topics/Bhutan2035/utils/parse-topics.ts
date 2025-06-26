/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTopic, TopicColors } from "../ClaimTopicItem";

const parseTopics = (data: any): TTopic[] => {
  const claimIdToIndexMappings: Map<string, number> = new Map();
  const userIdToIndexMappings: Map<string, number> = new Map();
  const topics = data.data[1].topics;
  return topics.map((topic: any) => {
    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      colorIndex: Math.floor(Math.random() * TopicColors.length),
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
                  userIdToIndexMappings.get(claim.id) ??
                    userIdToIndexMappings.size + 1
                );
                return {
                  id: quote.id,
                  text: quote.text,
                  authorId: quote.reference.interview,
                  authorIndex: userIdToIndexMappings.get(
                    quote.reference.interview
                  ),
                };
              }),
            };
          }),
        };
      }),
    };
  });
};

export default parseTopics;
