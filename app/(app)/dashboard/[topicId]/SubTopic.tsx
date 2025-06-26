"use client";

import ClaimBoxes from "@/app/_components/Bhutan2035/ClaimBoxes";
import { TSubtopic, TTopic } from "@/app/_components/Bhutan2035/TopicItem";
import { TDemographics } from "@/app/_components/Bhutan2035/utils/fetch-demographics";
import React, { useState } from "react";

const SubTopic = ({
  subtopic,
  topic,
  demographics,
}: {
  subtopic: TSubtopic;
  topic: TTopic;
  demographics: TDemographics;
}) => {
  const [hoveredClaimId, setHoveredClaimId] = useState<string | null>(null);
  return (
    <div>
      <h3 className="text-xl font-bold">{subtopic.title}</h3>
      <p>{subtopic.description}</p>

      <div className="mt-2">
        <ClaimBoxes
          data={{
            title: topic.title,
            id: topic.id,
            description: topic.description,
            subtopics: [subtopic],
            colorIndex: topic.colorIndex,
          }}
          highlightedClaimIds={
            hoveredClaimId ? new Set([hoveredClaimId]) : new Set()
          }
          size="lg"
          demographics={demographics}
        />
      </div>

      <ul className="flex flex-col gap-1 mt-2">
        {subtopic.claims.map((claim) => {
          return (
            <li
              key={claim.id}
              onMouseEnter={() => setHoveredClaimId(claim.id)}
              onMouseMove={() => setHoveredClaimId(claim.id)}
              onMouseLeave={() => setHoveredClaimId(null)}
            >
              <span className="font-bold">#{claim.index}</span>
              &nbsp;&nbsp;
              <span>{claim.content}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubTopic;
