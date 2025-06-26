"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TClaim, TSubtopic } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import React from "react";
import { MessageCircle } from "lucide-react";

const countPeopleInClaims = (claims: TClaim[]) => {
  const people = new Set<string>();
  claims.forEach((claim) => {
    claim.quotes.forEach((quote) => {
      people.add(quote.authorId);
    });
  });
  return people.size;
};

const SubtopicPopup = ({
  trigger,
  asChild,
  data,
  colorIndex,
  onHoverStart,
  onHoverEnd,
}: {
  trigger: React.ReactNode;
  asChild?: boolean;
  data: TSubtopic;
  colorIndex: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) => {
  return (
    <Tooltip
      onOpenChange={(open) => {
        if (open) {
          onHoverStart();
        } else {
          onHoverEnd();
        }
      }}
    >
      <TooltipTrigger
        asChild={asChild}
        onMouseEnter={onHoverStart}
        onMouseMove={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        {trigger}
      </TooltipTrigger>
      <TooltipContent
        onMouseEnter={onHoverStart}
        onMouseMove={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <div className="w-[80vw] sm:w-[300px] flex flex-col gap-4 text-wrap">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{data.title}</span>
            </div>
            <span
              className="text-base font-semibold mt-1 text-wrap"
              style={{
                color: `rgb(${TopicColors[colorIndex]})`,
              }}
            >
              {data.description}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageCircle className="size-4" /> {data.claims.length} claims
              by {countPeopleInClaims(data.claims)} people
            </span>
          </div>
        </div>{" "}
      </TooltipContent>
    </Tooltip>
  );
};

export default SubtopicPopup;
