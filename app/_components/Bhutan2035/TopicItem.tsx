"use client";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import ClaimBoxes from "./ClaimBoxes";
import SubtopicPopup from "./SubtopicPopup";
import { TopicColors } from "./utils/parse-topics";
import { TDemographics } from "./utils/fetch-demographics";

export type TQuote = {
  id: string;
  text: string;
  authorId: string;
  authorIndex: number;
};

export type TClaim = {
  id: string;
  index: number;
  content: string;
  quotes: TQuote[];
  similarClaims?: TSimilarClaim[];
};

export type TSimilarClaim = {
  id: string;
  title: string;
  quotes: TQuote[];
  number: number;
  similarClaims?: TSimilarClaim[];
};

export type TSubtopic = {
  id: string;
  title: string;
  description: string;
  claims: TClaim[];
};

export type TTopic = {
  id: string;
  title: string;
  description: string;
  subtopics: TSubtopic[];
  colorIndex: number;
};

const calculateTotalPeople = (topic: TTopic) => {
  const people = new Set<string>();
  topic.subtopics.forEach((subtopic) => {
    subtopic.claims.forEach((claim) => {
      claim.quotes.forEach((quote) => {
        people.add(quote.authorId);
      });
    });
  });
  return people.size;
};

const TopicItem = ({
  data,
  demographics,
  filter,
}: {
  data: TTopic;
  demographics: TDemographics;
  filter?: {
    gender: TDemographics[string]["gender"][];
    age: TDemographics[string]["ageGroup"][];
  };
}) => {
  const [highlightedSubtopicId, setHighlightedSubtopicId] = useState<
    string | null
  >(null);

  const authorMatchesFilter = (authorId: string) => {
    if (!filter) return true;
    const gender = demographics[authorId]?.gender;
    const age = demographics[authorId]?.ageGroup;
    if (!gender || !age) return false;

    const matchesGender = filter.gender.includes(gender);
    const matchesAge = filter.age.includes(age);
    if (matchesAge !== matchesGender) return true;
    return matchesGender && matchesAge;
  };

  const filteredClaimIds: string[] = [];
  data.subtopics.forEach((subtopic) => {
    subtopic.claims.forEach((claim) => {
      claim.quotes.forEach((quote) => {
        if (authorMatchesFilter(quote.authorId)) {
          filteredClaimIds.push(claim.id);
        }
      });
    });
  });

  const getHighlightedSubtopicClaimIds = (subtopicId: string) => {
    const subtopic = data.subtopics.find(
      (subtopic) => subtopic.id === subtopicId
    );
    if (!subtopic) return [];
    return subtopic.claims
      .filter((claim) => {
        return filteredClaimIds.includes(claim.id);
      })
      .map((claim) => claim.id);
  };

  const highlightedClaimIds = filter
    ? new Set(filteredClaimIds)
    : highlightedSubtopicId
    ? new Set(getHighlightedSubtopicClaimIds(highlightedSubtopicId))
    : new Set<string>();

  const totalClaims = data.subtopics.reduce((acc, subtopic) => {
    return acc + subtopic.claims.length;
  }, 0);
  const totalPeople = calculateTotalPeople(data);

  return (
    <article className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <ClaimBoxes
            data={data}
            highlightedClaimIds={highlightedClaimIds}
            demographics={demographics}
          />
        </div>
        <div className="order-1 lg:order-2 space-y-4">
          <header className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight">{data.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="size-4" />
              <span>{totalClaims} claims by {totalPeople} people</span>
            </div>
          </header>
          
          <p className="text-sm leading-relaxed text-foreground/80">{data.description}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Subtopics</h4>
            <div className="flex flex-wrap gap-1">
              {data.subtopics.slice(0, 5).map((subtopic, index) => (
                <SubtopicPopup
                  key={subtopic.id}
                  data={subtopic}
                  colorIndex={data.colorIndex}
                  asChild
                  onHoverStart={() => setHighlightedSubtopicId(subtopic.id)}
                  onHoverEnd={() => setHighlightedSubtopicId(null)}
                  trigger={
                    <a
                      className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                      style={{
                        color: `rgb(${TopicColors[data.colorIndex]})`,
                      }}
                      href={`/dashboard/${data.id}#${subtopic.id}`}
                    >
                      {subtopic.title}
                    </a>
                  }
                />
              ))}
              {data.subtopics.length > 5 && (
                <a
                  className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
                  href={`/dashboard/${data.id}`}
                >
                  +{data.subtopics.length - 5} more
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TopicItem;
