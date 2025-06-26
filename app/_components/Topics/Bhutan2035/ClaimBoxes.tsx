import React from "react";
import { TDemographics, TTopic } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import ClaimPopup from "./ClaimPopup";
import { cn } from "@/lib/utils";

const ClaimBoxes = ({
  data,
  highlightedSubtopicId,
  size = "sm",
  demographics,
  filter,
}: {
  data: TTopic;
  highlightedSubtopicId: string | null;
  size?: "sm" | "lg";
  demographics: TDemographics;
  filter?: {
    gender: string[];
    age: string[];
  };
}) => {
  let claimNumber = 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.subtopics.map((subtopic) => {
        return subtopic.claims.map((claim) => {
          claimNumber += 1;

          // Check if author is in the selected gender/age filters
          const authorId = claim.quotes[0].authorId;
          const ageData = demographics.age;
          
          let isInGenderFilter = false;
          let isInAgeFilter = false;
          
          if (filter?.gender && filter.gender.length > 0) {
            if (filter.gender.includes("male")) {
              isInGenderFilter = demographics.gender.Male?.includes(authorId)
              console.log("authorId", authorId, "isInGenderFilter", isInGenderFilter, demographics.gender.Male)
            } else if (filter.gender.includes("female")) {
              isInGenderFilter = demographics.gender.Female?.includes(authorId)
            } else if (filter.gender.includes("male") && filter.gender.includes("female")) {
              isInGenderFilter = demographics.gender.Male?.includes(authorId) || demographics.gender.Female?.includes(authorId)
            }
          }
          
          if (filter?.age && filter.age.length > 0) {
            isInAgeFilter = filter.age.some(age => {
              const ageKey = age === "18-24" ? "age_18_25" : 
                           age === "25-35" ? "age_25_35" : 
                           age === "35-50" ? "age_35_55" : 
                           age === "50+" ? "over_55" : age;
              return ageData[ageKey]?.includes(authorId);
            });
          }
          
          const isFiltered = isInGenderFilter || isInAgeFilter;
          const isHighlighted = isFiltered || highlightedSubtopicId === subtopic.id;
          
          return (
            <ClaimPopup
              demographics={demographics}
              key={claim.id}
              data={claim}
              colorIndex={data.colorIndex}
              asChild
              trigger={
                <button
                  className={cn(
                    "relative group flex items-center justify-center border rounded-sm overflow-hidden",
                    size === "sm"
                      ? "h-5 w-5 text-[0.6rem]"
                      : "h-10 w-10 text-[1rem]"
                  )}
                  style={{
                    borderColor: `rgb(${TopicColors[data.colorIndex]})`,
                    color: `rgb(${TopicColors[data.colorIndex]})`,
                  }}
                >
                  <div
                    className={cn(
                      "absolute inset-0 hidden group-hover:block z-10",
                      isHighlighted ? "block" : "hidden"
                    )}
                    style={{
                      background: `rgb(${TopicColors[data.colorIndex]})`,
                    }}
                  ></div>
                  <span
                    className={cn(
                      "group-hover:text-white relative z-20",
                      isHighlighted ? "text-white" : ""
                    )}
                  >
                    {claimNumber}
                  </span>
                </button>
              }
              subtopicTitle={subtopic.title}
            />
          );
        });
      })}
    </div>
  );
};

export default ClaimBoxes;
