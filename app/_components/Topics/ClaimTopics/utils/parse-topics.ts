/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTopic, TopicColors } from "../ClaimTopicItem";

const parseTopics = (data: any): TTopic[] => {
  const topics = data.data[1].topics;
  return topics.map((topic: any) => {
    return {
      id: topic.id as string,
      title: topic.title as string,
      description: topic.description as string,
      colorIndex: Math.floor(Math.random() * TopicColors.length),
      subtopics: topic.subtopics.map((subtopic: any) => {
        return {
          id: subtopic.id as string,
          title: subtopic.title as string,
          description: subtopic.description as string,
          claims: subtopic.claims.map((claim: any) => {
            return {
              id: claim.id as string,
              content: claim.content as string,
              quotes: claim.quotes.map((quote: any) => {
                return {
                  id: quote.id as string,
                  text: quote.text as string,
                  authorId: quote.reference.id,
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
