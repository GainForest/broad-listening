import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TClaim, TopicColors } from "./ClaimTopicItem";
import { blo } from "blo";
import { Quote } from "lucide-react";
import React from "react";

const ClaimPopup = ({
  trigger,
  asChild,
  data,
  colorIndex,
}: {
  trigger: React.ReactNode;
  asChild?: boolean;
  data: TClaim;
  colorIndex: number;
}) => {
  console.log(data);
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent>
        <div className="w-[80vw] sm:w-[300px] flex flex-col gap-4 text-wrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground font-bold">
              Claim #{data.index}
            </span>
            <span
              className="text-sm text-wrap"
              style={{
                color: `rgb(${TopicColors[colorIndex]})`,
              }}
            >
              {data.content}
            </span>
            <div className="p-2 rounded-lg bg-muted/50 mt-1">
              <b>Do you agree with this claim?</b>
              <div className="flex items-center w-full rounded-md overflow-hidden mt-1">
                <button className="flex-1 bg-red-500/10 text-red-700 py-1">
                  No
                </button>
                <button className="flex-1 bg-yellow-500/10 text-yellow-700 py-1">
                  Maybe
                </button>
                <button className="flex-1 bg-green-500/10 text-green-700 py-1">
                  Yes
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Quote className="size-4" />
              <span>Quotes</span>
            </div>
            <div className="mt-2">
              {data.quotes.map((quote) => (
                <div key={quote.id}>
                  <q className="text-sm italic">{quote.text}</q>
                </div>
              ))}
            </div>
          </div>
          {/* <hr /> */}
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-8 w-8 rounded-full border border-border overflow-hidden">
              <img src={blo("0x123")} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{}</span>
              <span className="text-muted-foreground">Male • 13yo</span>
            </div>
          </div>
        </div>{" "}
      </TooltipContent>
    </Tooltip>
  );
};

export default ClaimPopup;
