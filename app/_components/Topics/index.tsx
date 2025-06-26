import { Info } from "lucide-react";
import React from "react";
import Bhutan2035 from "./Bhutan2035";

const Topics = () => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">Bhutan 2035</h2>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xl font-bold">Summary</h3>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Info className="size-4" />
          <span>
            The summary is written by the report creators, while the rest is
            AI-generated, excluding quotes.
          </span>
        </span>
        <p className="text-justify">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore,
          quas aperiam, molestiae cupiditate in ipsum odio suscipit perferendis
          voluptatibus ad asperiores magni excepturi placeat similique adipisci,
          numquam fugit officia esse.
        </p>
      </div>
      <Bhutan2035 />
    </div>
  );
};

export default Topics;
