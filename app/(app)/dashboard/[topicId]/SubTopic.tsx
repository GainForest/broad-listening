"use client";

import ClaimBoxes from "@/app/_components/Bhutan2035/ClaimBoxes";
import ClaimPopup from "@/app/_components/Bhutan2035/ClaimPopup";
import { TSubtopic, TTopic } from "@/app/_components/Bhutan2035/TopicItem";
import { TDemographics } from "@/app/_components/Bhutan2035/utils/fetch-demographics";
import { Button } from "@/components/ui/button";
import { Link, Quote } from "lucide-react";
import React, { useState } from "react";

const INITIAL_CLAIMS_SHOW = 8;

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
  const [showAllClaims, setShowAllClaims] = useState(false);

  const displayedClaims = showAllClaims 
    ? subtopic.claims 
    : subtopic.claims.slice(0, INITIAL_CLAIMS_SHOW);
  
  const remainingClaims = subtopic.claims.length - INITIAL_CLAIMS_SHOW;
  const shouldShowMoreButton = !showAllClaims && remainingClaims > 0;

  const getQuotesCount = (claim: any) => {
    const mainQuotes = claim.quotes?.length || 0;
    const similarQuotes = claim.similarClaims?.reduce((acc: number, similarClaim: any) => 
      acc + (similarClaim.quotes?.length || 0), 0) || 0;
    return mainQuotes + similarQuotes;
  };

  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-xl font-semibold mb-2">{subtopic.title}</h3>
        <p className="text-muted-foreground">{subtopic.description}</p>
      </header>

      <div>
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

      <div className="space-y-3">
        <h4 className="text-lg font-medium">Claims</h4>
        <div className="space-y-1">
          {displayedClaims.map((claim) => {
            const quotesCount = getQuotesCount(claim);
            
            return (
              <div
                key={claim.id}
                className="group flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50"
                onMouseEnter={() => setHoveredClaimId(claim.id)}
                onMouseLeave={() => setHoveredClaimId(null)}
              >
                <div className="flex-1 flex items-start gap-2">
                  <span className="text-xs font-bold text-muted-foreground min-w-[1.5rem] mt-0.5">
                    #{claim.index}
                  </span>
                  <span className="text-sm leading-relaxed">{claim.content}</span>
                </div>
                
                <div className="flex items-center gap-2 ml-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {quotesCount > 0 && (
                      <ClaimPopup
                        data={claim}
                        colorIndex={topic.colorIndex}
                        subtopicTitle={subtopic.title}
                        demographics={demographics}
                        trigger={
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded cursor-pointer hover:bg-blue-100 transition-colors">
                            <Quote className="size-3" />
                            <span className="font-medium text-xs">{quotesCount}</span>
                          </div>
                        }
                      />
                    )}
                  </div>
                  
                  <ClaimPopup
                    data={claim}
                    colorIndex={topic.colorIndex}
                    subtopicTitle={subtopic.title}
                    demographics={demographics}
                    trigger={
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded">
                        <Link className="size-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {shouldShowMoreButton && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAllClaims(true)}
              className="text-sm"
            >
              {remainingClaims} more claims
            </Button>
          </div>
        )}

        {showAllClaims && subtopic.claims.length > INITIAL_CLAIMS_SHOW && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => setShowAllClaims(false)}
              className="text-sm text-muted-foreground"
            >
              Show less
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubTopic;
