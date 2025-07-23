"use client";

import TopicItem, { TTopic } from "./TopicItem";
import { Book, MessageCircle, Users } from "lucide-react";
import { TDemographics } from "./utils/fetch-demographics";

export const TopicsDisplay = ({
  topics,
  totalUniqueClaims,
  totalUniquePeople,
  demographics,
  reportUrl,
}: {
  topics: TTopic[];
  totalUniqueClaims: number;
  totalUniquePeople: number;
  demographics: TDemographics;
  reportUrl: string;
}) => {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Claims</h2>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Book className="size-4" />
            <span className="font-medium">{topics.length} Topics</span>
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            <span className="font-medium">{totalUniqueClaims} Claims</span>
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4" />
            <span className="font-medium">{totalUniquePeople} People</span>
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => {
          return (
            <TopicItem
              key={topic.title}
              data={topic}
              demographics={demographics}
              reportUrl={reportUrl}
            />
          );
        })}
      </div>
    </section>
  );
};
