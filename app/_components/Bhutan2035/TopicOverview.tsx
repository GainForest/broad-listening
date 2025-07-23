"use client";

import { ChevronRight } from "lucide-react";
import { TTopic } from "./TopicItem";
import { TopicColors } from "./utils/parse-topics";
import Link from "next/link";

interface TopicOverviewProps {
  topics: TTopic[];
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

const TopicOverview = ({ topics }: TopicOverviewProps) => {
  // Calculate people count for each topic and sort by participation (descending)
  const topicsWithPeople = topics
    .map((topic) => ({
      ...topic,
      peopleCount: calculateTotalPeople(topic),
    }))
    .sort((a, b) => b.peopleCount - a.peopleCount);

  const maxPeople = Math.max(...topicsWithPeople.map(t => t.peopleCount));

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
      <div className="space-y-2">
        {topicsWithPeople.map((topic) => {
          const progressPercentage = maxPeople > 0 ? (topic.peopleCount / maxPeople) * 100 : 0;
          
          return (
            <Link
              key={topic.id}
              href={`/dashboard/${topic.id}`}
              className="group block"
            >
              <div className="py-4 px-3 hover:bg-muted/30 rounded-lg transition-all duration-200 border border-transparent hover:border-border/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{topic.peopleCount} people</span>
                      <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-90"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: `rgb(${TopicColors[topic.colorIndex]})`,
                          opacity: '0.8'
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