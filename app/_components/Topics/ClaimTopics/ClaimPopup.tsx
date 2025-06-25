import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { blo } from "blo";
import { Quote } from "lucide-react";
import React from "react";

const ClaimPopup = ({
  trigger,
  asChild,
}: {
  trigger: React.ReactNode;
  asChild?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
      <TooltipContent>
        <div className="w-[80vw] sm:w-[300px] flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Claim #1</span>
            <span className="text-sm text-wrap">
              This is the very first claim. This is the very first claim.
            </span>
          </div>
          <hr />
          <div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Quote className="size-4" />
              <span>2 hrs ago</span>
            </div>
            <q className="text-sm italic">
              This is quoted exact claim by the user.
            </q>
          </div>
          {/* <hr /> */}
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-8 w-8 rounded-full border border-border overflow-hidden">
              <img src={blo("0x123")} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">0xdid_of_user</span>
              <span className="text-muted-foreground">Male • 13yo</span>
            </div>
          </div>
        </div>{" "}
      </TooltipContent>
    </Tooltip>
  );
};

export default ClaimPopup;
