import React from "react";
import { TTopic } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import ClaimPopup from "./ClaimPopup";
import { cn } from "@/lib/utils";
import { TDemographics } from "./utils/fetch-demographics";

const ClaimBoxes = ({
  data,
  highlightedClaimIds,
  size = "sm",
  demographics,
}: {
  data: TTopic;
  highlightedClaimIds: Set<string>;
  size?: "sm" | "lg";
  demographics: TDemographics;
}) => {
  return (
    <div className="flex flex-wrap items-center gap-0.5">
      {data.subtopics.map((subtopic) => {
        return subtopic.claims.map((claim) => {
          const isHighlighted = highlightedClaimIds.has(claim.id);

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
                    "relative group cursor-pointer rounded transition-all duration-200",
                    size === "sm"
                      ? "h-3 w-3"
                      : "h-4 w-4",
                    isHighlighted 
                      ? "scale-110 shadow-sm" 
                      : "hover:scale-105"
                  )}
                  style={{
                    backgroundColor: isHighlighted 
                      ? `rgb(${TopicColors[data.colorIndex]})` 
                      : `rgba(${TopicColors[data.colorIndex]}, 0.3)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"
                    style={{
                      backgroundColor: `rgb(${TopicColors[data.colorIndex]})`,
                    }}
                  />
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
