"use client";

import { ChevronRight } from "lucide-react";
import { TTopic } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import Link from "next/link";

interface TopicOverviewProps {
  topics: TTopic[];
  reportUrl: string;
}

const calculateTotalPeople = (topic: TTopic) => {
  const people = new Set<string>();
  topic.subtopics.forEach((subtopic) => {
    subtopic.claims.forEach((claim) => {
      claim.quotes.forEach((quote) => {
        people.add(quote.authorId);
      });
    });
  });
  return people.size;
};

const TopicOverview = ({ topics, reportUrl }: TopicOverviewProps) => {
  // Calculate people count for each topic and sort by participation (descending)
  const topicsWithPeople = topics
    .map((topic) => ({
      ...topic,
      peopleCount: calculateTotalPeople(topic),
    }))
    .sort((a, b) => b.peopleCount - a.peopleCount);

  const maxPeople = Math.max(...topicsWithPeople.map(t => t.peopleCount));

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      <div className="space-y-1">
        {topicsWithPeople.map((topic) => {
          const progressPercentage = maxPeople > 0 ? (topic.peopleCount / maxPeople) * 100 : 0;
          
          return (
            <Link
              key={topic.id}
              href={`/dashboard/${topic.id}?report=${encodeURIComponent(reportUrl)}`}
              className="group block"
            >
              <div className="py-2 px-3 hover:bg-muted/30 rounded transition-all duration-200">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium">{topic.peopleCount}</span>
                      <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: `rgb(${TopicColors[topic.colorIndex]})`,
                          opacity: '0.7'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default TopicOverview; 