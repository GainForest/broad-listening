import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TClaim } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import { blo } from "blo";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import React from "react";
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
  // Get the first quote's author information
  const firstQuote = data.quotes[0];
  const authorId = firstQuote?.authorId;

  const authorGender = demographics[authorId]?.gender;
  const authorAgeGroup = demographics[authorId]?.ageGroup;

  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent>
        <div className="w-[80vw] sm:w-[300px] flex flex-col gap-4 text-wrap">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{subtopicTitle}</span>
              <span className="text-xs text-right text-muted-foreground font-bold">
                Claim #{data.index}
              </span>
            </div>
            <span
              className="text-base font-semibold mt-1 text-wrap"
              style={{
                color: `rgb(${TopicColors[colorIndex]})`,
              }}
            >
              {data.content}
            </span>
            <VotingSection claimId={data.id} />
          </div>
          <hr />
          <div>
            <div className="flex items-center justify-between gap-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Quote className="size-4" />
                <span>Quotes</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-full border border-border cursor-pointer">
                  <ChevronLeft className="size-4" />
                </button>
                <span>1/1</span>
                <button className="rounded-full border border-border cursor-pointer">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              {data.quotes.map((quote) => (
                <div key={quote.id}>
                  <q className="text-sm italic">{quote.text}</q>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-0.5 mt-1">
              <div className="h-5 w-5 rounded-full border border-border overflow-hidden">
                <img src={blo(`0x${authorId}`)} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{authorId?.substring(0, 8)}</span>
                <span className="text-muted-foreground">
                  {authorGender && authorAgeGroup
                    ? `${authorGender
                        .charAt(0)
                        .toUpperCase()} • ${authorAgeGroup} years old`
                    : "Unknown demographics"}
                </span>
              </div>
            </div>
          </div>
        </div>{" "}
      </TooltipContent>
    </Tooltip>
  );
};

export default ClaimPopup;
