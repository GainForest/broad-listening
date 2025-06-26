/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTopic, TopicColors } from "../ClaimTopicItem";

const parseTopics = (data: any): TTopic[] => {
  const claimIdToIndexMappings: Record<string, number> = {};
  const userIdToIndexMappings: Record<string, number> = {};
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
            claimIdToIndexMappings[claim.id] =
              claimIdToIndexMappings[claim.id] || claimIdToIndexMappings.length;
            return {
              index: claimIdToIndexMappings[claim.id],
              id: claim.id,
              content: claim.content,
              quotes: claim.quotes.map((quote: any) => {
                userIdToIndexMappings[quote.reference.id] =
                  userIdToIndexMappings[quote.reference.id] ||
                  userIdToIndexMappings.length;
                return {
                  id: quote.id,
                  text: quote.text,
                  authorId: quote.interview,
                  authorIndex: userIdToIndexMappings[quote.reference.id],
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
