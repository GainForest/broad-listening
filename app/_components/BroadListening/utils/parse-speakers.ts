/* eslint-disable @typescript-eslint/no-explicit-any */
import { TTopic, TClaim, TQuote, TSimilarClaim } from "../TopicItem";

export type TSpeakerClaim = {
  id: string;
  title: string;
  content: string;
  topic: {
    id: string;
    title: string;
    colorIndex: number;
  };
  subtopic: {
    id: string;
    title: string;
  };
  quote: TQuote;
  isSimilarClaim?: boolean;
  originalClaimId?: string;
};

export type TSpeaker = {
  id: string;
  name: string;
  claims: TSpeakerClaim[];
  topicsCount: number;
  subtopicsCount: number;
  quotesCount: number;
  topicDistribution: Record<string, number>;
};

export type TClaimAgreement = {
  claimId: string;
  claimTitle: string;
  speakers: {
    speakerId: string;
    speakerName: string;
    quote: string;
    isSimilarClaim?: boolean;
  }[];
};

const parseSpeakers = (topics: TTopic[]): { 
  speakers: TSpeaker[];
  claimAgreements: Record<string, TClaimAgreement>;
} => {
  const speakerMap = new Map<string, TSpeaker>();
  const claimAgreements: Record<string, TClaimAgreement> = {};

  // Function to add speaker claim
  const addSpeakerClaim = (
    speakerId: string,
    claim: TClaim | TSimilarClaim,
    topic: TTopic,
    subtopic: any,
    quote: TQuote,
    isSimilarClaim = false,
    originalClaimId?: string
  ) => {
    if (!speakerMap.has(speakerId)) {
      speakerMap.set(speakerId, {
        id: speakerId,
        name: speakerId,
        claims: [],
        topicsCount: 0,
        subtopicsCount: 0,
        quotesCount: 0,
        topicDistribution: {},
      });
    }

    const speaker = speakerMap.get(speakerId)!;
    
    const claimTitle = 'title' in claim ? claim.title : (claim as TClaim).content;
    
    speaker.claims.push({
      id: claim.id,
      title: claimTitle,
      content: claimTitle,
      topic: {
        id: topic.id,
        title: topic.title,
        colorIndex: topic.colorIndex,
      },
      subtopic: {
        id: subtopic.id,
        title: subtopic.title,
      },
      quote,
      isSimilarClaim,
      originalClaimId,
    });

    speaker.quotesCount++;
    
    // Update topic distribution
    if (!speaker.topicDistribution[topic.title]) {
      speaker.topicDistribution[topic.title] = 0;
    }
    speaker.topicDistribution[topic.title]++;
  };

  // Function to add to claim agreements
  const addToClaimAgreement = (
    claimId: string,
    claimTitle: string,
    speakerId: string,
    quote: string,
    isSimilarClaim = false
  ) => {
    if (!claimAgreements[claimId]) {
      claimAgreements[claimId] = {
        claimId,
        claimTitle,
        speakers: [],
      };
    }

    claimAgreements[claimId].speakers.push({
      speakerId,
      speakerName: speakerId,
      quote,
      isSimilarClaim,
    });
  };

  // Traverse all topics, subtopics, claims, and quotes
  for (const topic of topics) {
    for (const subtopic of topic.subtopics) {
      for (const claim of subtopic.claims) {
        // Process main claim quotes
        for (const quote of claim.quotes) {
          const speakerId = quote.authorId;
          addSpeakerClaim(speakerId, claim, topic, subtopic, quote);
          addToClaimAgreement(claim.id, claim.content, speakerId, quote.text);
        }

        // Process similar claims
        for (const similarClaim of claim.similarClaims || []) {
          for (const quote of similarClaim.quotes || []) {
            const speakerId = quote.authorId;
            addSpeakerClaim(speakerId, similarClaim, topic, subtopic, quote, true, claim.id);
            addToClaimAgreement(claim.id, claim.content, speakerId, quote.text, true);
          }
        }
      }
    }
  }

  // Calculate unique topics and subtopics for each speaker
  for (const speaker of speakerMap.values()) {
    const uniqueTopics = new Set(speaker.claims.map(c => c.topic.id));
    const uniqueSubtopics = new Set(speaker.claims.map(c => c.subtopic.id));
    
    speaker.topicsCount = uniqueTopics.size;
    speaker.subtopicsCount = uniqueSubtopics.size;
  }

  const speakers = Array.from(speakerMap.values())
    .sort((a, b) => b.quotesCount - a.quotesCount); // Sort by most active speakers

  return { speakers, claimAgreements };
};

export default parseSpeakers; 