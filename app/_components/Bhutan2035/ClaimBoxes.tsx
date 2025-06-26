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
  let claimNumber = 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.subtopics.map((subtopic) => {
        return subtopic.claims.map((claim) => {
          claimNumber += 1;

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
