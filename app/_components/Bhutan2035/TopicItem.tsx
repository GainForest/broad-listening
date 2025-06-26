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
    <div className="p-3 flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <ClaimBoxes
          data={data}
          highlightedClaimIds={highlightedClaimIds}
          demographics={demographics}
        />
      </div>
      <div className="flex-1">
        <h4 className="font-bold">{data.title}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle className="size-4" /> {totalClaims} claims by{" "}
          {totalPeople} people.
        </div>
        <p className="text-sm mt-2">{data.description}</p>
        <b className="text-sm font-bold">Subtopics:&nbsp;</b>
        {data.subtopics.map((subtopic, index) => {
          if (index > 4) return null;
          return (
            <SubtopicPopup
              key={index}
              data={subtopic}
              colorIndex={data.colorIndex}
              asChild
              onHoverStart={() => setHighlightedSubtopicId(subtopic.id)}
              onHoverEnd={() => setHighlightedSubtopicId(null)}
              trigger={
                <a
                  key={subtopic.title}
                  className="text-sm hover:underline mr-1"
                  style={{
                    color: `rgb(${TopicColors[data.colorIndex]})`,
                  }}
                  href={`/dashboard/${data.id}#${subtopic.id}`}
                >
                  {subtopic.title}
                  {index < data.subtopics.length - 1 && ","}
                </a>
              }
            />
          );
        })}
        {data.subtopics.length > 4 && (
          <a
            className="rounded-full flex items-center gap-1 text-primary text-sm underline"
            href={`/dashboard/${data.id}`}
          >
            View all subtopics
          </a>
        )}
      </div>
    </div>
  );
};

export default TopicItem;
