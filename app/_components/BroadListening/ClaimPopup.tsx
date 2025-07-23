import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TClaim } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import { blo } from "blo";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TDemographics } from "./utils/fetch-demographics";
import VotingSection from "./VotingSection";

const ClaimPopup = ({
  trigger,
  asChild,
  data,
  colorIndex,
  subtopicTitle,
  demographics,
}: {
  trigger: React.ReactNode;
  asChild?: boolean;
  data: TClaim;
  colorIndex: number;
  subtopicTitle: string;
  demographics: TDemographics;
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Reset quote index when claim changes
  useEffect(() => {
    setCurrentQuoteIndex(0);
  }, [data.id]);
  
  // Collect all quotes from main claim and similar claims with source info
  const allQuotes = [
    ...data.quotes.map(quote => ({ ...quote, source: 'main' as const, claimTitle: data.content })),
    ...(data.similarClaims || []).flatMap((similarClaim) => 
      (similarClaim.quotes || []).map(quote => ({ 
        ...quote, 
        source: 'similar' as const, 
        claimTitle: similarClaim.title 
      }))
    )
  ];

  // Get the current quote's author information
  const currentQuote = allQuotes[currentQuoteIndex];
  const authorId = currentQuote?.authorId;

  const authorGender = demographics[authorId]?.gender;
  const authorAgeGroup = demographics[authorId]?.ageGroup;

  const totalQuotes = allQuotes.length;
  const canGoPrevious = currentQuoteIndex > 0;
  const canGoNext = currentQuoteIndex < totalQuotes - 1;

  // Debug logging to see quote data
  const similarQuotesCount = (data.similarClaims || []).reduce((acc, claim) => acc + (claim.quotes?.length || 0), 0);
  console.log(`Claim ${data.index} has ${totalQuotes} total quotes (${data.quotes.length} main + ${similarQuotesCount} from similar claims):`, allQuotes);

  // Safety check: if currentQuoteIndex is out of bounds, reset it
  const safeCurrentQuoteIndex = Math.max(0, Math.min(currentQuoteIndex, totalQuotes - 1));
  if (safeCurrentQuoteIndex !== currentQuoteIndex) {
    setCurrentQuoteIndex(safeCurrentQuoteIndex);
  }

  const handlePreviousQuote = () => {
    if (canGoPrevious) {
      setCurrentQuoteIndex(currentQuoteIndex - 1);
    }
  };

  const handleNextQuote = () => {
    if (canGoNext) {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent className="p-0 border-0">
        <div className="w-[85vw] sm:w-[400px] bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-4">
            <header className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">{subtopicTitle}</span>
                <span className="px-2 py-1 bg-muted/50 rounded text-muted-foreground font-medium">
                  Claim #{data.index}
                </span>
              </div>
              <h3
                className="text-base font-medium leading-relaxed"
                style={{
                  color: `rgb(${TopicColors[colorIndex]})`,
                }}
              >
                {data.content}
              </h3>
              <VotingSection claimId={data.id} />
            </header>
            
            <div className="h-px bg-border"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Quote className="size-4" />
                  <span className="font-medium">Quotes</span>
                </div>
                {totalQuotes > 1 && (
                  <div className="flex items-center gap-2">
                    <button 
                      className={`p-1.5 rounded-md border transition-colors ${
                        canGoPrevious 
                          ? 'hover:bg-muted text-foreground' 
                          : 'opacity-50 cursor-not-allowed text-muted-foreground'
                      }`}
                      onClick={handlePreviousQuote}
                      disabled={!canGoPrevious}
                    >
                      <ChevronLeft className="size-3" />
                    </button>
                    <span className="text-xs text-muted-foreground min-w-[2rem] text-center">
                      {currentQuoteIndex + 1}/{totalQuotes}
                    </span>
                    <button 
                      className={`p-1.5 rounded-md border transition-colors ${
                        canGoNext 
                          ? 'hover:bg-muted text-foreground' 
                          : 'opacity-50 cursor-not-allowed text-muted-foreground'
                      }`}
                      onClick={handleNextQuote}
                      disabled={!canGoNext}
                    >
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {currentQuote ? (
                  <>
                    <blockquote className="text-sm leading-relaxed italic text-foreground/90 pl-3 border-l-2 border-muted">
                      &quot;{currentQuote.text}&quot;
                    </blockquote>
                    {authorId && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="h-6 w-6 rounded-full border overflow-hidden bg-muted">
                          <img 
                            src={blo(`0x${authorId}`)} 
                            alt="Author avatar"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-foreground">
                            {authorId.substring(0, 8)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {authorGender && authorAgeGroup
                              ? `${authorGender.charAt(0).toUpperCase()} • ${authorAgeGroup} years old`
                              : "Unknown demographics"}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No quotes available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default ClaimPopup;
