import React from "react";
import { TTopic, TopicColors } from "./ClaimTopicItem";
import ClaimPopup from "./ClaimPopup";

const ClaimBoxes = ({ data }: { data: TTopic }) => {
  let claimNumber = 0;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {data.subtopics.map((subtopic) => {
        return subtopic.claims.map((claim) => {
          claimNumber += 1;
          return (
            <ClaimPopup
              key={claim.id}
              data={claim}
              asChild
              trigger={
                <button
                  className="relative group h-5 w-5 flex items-center justify-center border rounded-sm overflow-hidden"
                  style={{
                    borderColor: `rgb(${TopicColors[data.colorIndex]})`,
                    color: `rgb(${TopicColors[data.colorIndex]})`,
                  }}
                >
                  <div
                    className="absolute inset-0 hidden group-hover:block z-10"
                    style={{
                      background: `rgb(${TopicColors[data.colorIndex]})`,
                    }}
                  ></div>
                  <span className="group-hover:text-white text-[0.6rem] relative z-20">
                    {claimNumber}
                  </span>
                </button>
              }
            />
          );
        });
      })}
    </div>
  );
};

export default ClaimBoxes;
