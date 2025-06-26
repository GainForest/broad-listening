import { MessageCircle } from "lucide-react";
import React from "react";
import ClaimPopup from "./ClaimPopup";

export type TClaimTopic = {
  title: string;
  claims: number;
  people: number;
  description: string;
  subtopics: {
    title: string;
  }[];
};

const ClaimTopicItem = ({ data }: { data: TClaimTopic }) => {
  return (
    <div className="p-3 flex flex-col md:flex-row gap-3">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: data.claims }).map((_, index) => {
            return (
              <ClaimPopup
                key={index}
                asChild
                trigger={
                  <button className="h-5 w-5 border border-primary/50 rounded-sm hover:border-primary hover:bg-primary text-[0.6rem] text-primary hover:text-primary-foreground">
                    {index + 1}
                  </button>
                }
              />
            );
          })}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold">{data.title}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageCircle className="size-4" /> {data.claims} claims by{" "}
          {data.people} people.
        </div>
        <p className="text-sm mt-2">{data.description}</p>
        <b className="text-sm font-bold">Subtopics:&nbsp;</b>
        {data.subtopics.map((subtopic, index) => {
          if (index > 4) return null;
          return (
            <ClaimPopup
              key={index}
              asChild
              trigger={
                <a
                  key={subtopic.title}
                  className="text-primary text-sm hover:underline mr-1"
                  href="#"
                >
                  {subtopic.title}
                  {index < data.subtopics.length - 1 && ","}
                </a>
              }
            />
          );
        })}
        {data.subtopics.length > 4 && (
          <a
            className="rounded-full flex items-center gap-1 text-primary text-sm underline"
            href="#"
          >
            View all subtopics
          </a>
        )}
      </div>
    </div>
  );
};

export default ClaimTopicItem;
