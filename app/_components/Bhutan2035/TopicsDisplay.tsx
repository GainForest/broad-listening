"use client";

import { useState } from "react";
import TopicItem, { TTopic } from "./TopicItem";
import { Book, MessageCircle, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { TDemographics } from "./utils/fetch-demographics";

export const TopicsDisplay = ({
  topics,
  totalUniqueClaims,
  totalUniquePeople,
  demographics,
}: {
  topics: TTopic[];
  totalUniqueClaims: number;
  totalUniquePeople: number;
  demographics: TDemographics;
}) => {
  const [mode, setMode] = useState<"topics" | "demographics">("topics");
  const [genderFilter, setGenderFilter] = useState<
    Set<TDemographics[string]["gender"]>
  >(new Set());
  const [ageFilter, setAgeFilter] = useState<
    Set<TDemographics[string]["ageGroup"]>
  >(new Set());

  const ageGroups = [
    "<18",
    "18-25",
    "25-35",
    "35-55",
    "55+",
  ] satisfies TDemographics[string]["ageGroup"][];

  const updateGenderFilter = (gender: TDemographics[string]["gender"]) => {
    if (genderFilter.has(gender)) {
      setGenderFilter((prev) => {
        prev.delete(gender);
        return new Set(prev);
      });
    } else {
      setGenderFilter((prev) => {
        prev.add(gender);
        return new Set(prev);
      });
    }
  };

  const updateAgeFilter = (age: TDemographics[string]["ageGroup"]) => {
    if (ageFilter.has(age)) {
      setAgeFilter((prev) => {
        prev.delete(age);
        return new Set(prev);
      });
    } else {
      setAgeFilter((prev) => {
        prev.add(age);
        return new Set(prev);
      });
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-xl font-bold">Claims</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Book className="size-4" />
            {topics.length} Topics
          </span>
          <div className="h-4 w-0.5 bg-muted"></div>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-4" />
            {totalUniqueClaims} claims
          </span>
          <div className="h-4 w-0.5 bg-muted"></div>
          <span className="flex items-center gap-1">
            <Users className="size-4" />
            {totalUniquePeople} People
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Switch
            checked={mode === "demographics"}
            onCheckedChange={() =>
              setMode(mode === "demographics" ? "topics" : "demographics")
            }
          />
          <span className="font-bold text-sm text-muted-foreground">
            Filters
          </span>
        </span>
      </div>
      {mode === "demographics" && (
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex flex-col items-start">
            <span className="text-sm text-muted-foreground">
              Filter by gender
            </span>
            <div className="border border-border rounded-md flex items-center overflow-hidden">
              <button
                className={cn(
                  "transition-all text-xs px-2 py-1 hover:bg-blue-500/10",
                  genderFilter.has("male") &&
                    "bg-blue-500/20 hover:bg-blue-500/30 text-blue-500"
                )}
                onClick={() => updateGenderFilter("male")}
              >
                Male (
                {
                  Object.values(demographics).filter((d) => d.gender === "male")
                    .length
                }
                )
              </button>
              <button
                className={cn(
                  "transition-all text-xs px-2 py-1 hover:bg-pink-500/10",
                  genderFilter.has("female") &&
                    "bg-pink-500/20 hover:bg-pink-500/30 text-pink-500"
                )}
                onClick={() => updateGenderFilter("female")}
              >
                Female (
                {
                  Object.values(demographics).filter(
                    (d) => d.gender === "female"
                  ).length
                }
                )
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Filter by age</span>
            <div className="border border-border rounded-md flex items-center overflow-hidden">
              {ageGroups.map((age) => {
                return (
                  <button
                    key={age}
                    className={cn(
                      "transition-all text-xs px-2 py-1 hover:bg-primary/10",
                      ageFilter.has(age) &&
                        "bg-primary/20 hover:bg-primary/30 text-primary"
                    )}
                    onClick={() => updateAgeFilter(age)}
                  >
                    {age} (
                    {
                      Object.values(demographics).filter(
                        (d) => d.ageGroup === age
                      ).length
                    }
                    )
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex flex-col border border-border rounded-xl divide-y mt-3">
          {topics.map((topic) => {
            return (
              <TopicItem
                key={topic.title}
                data={topic}
                demographics={demographics}
                filter={
                  mode === "demographics"
                    ? {
                        gender: Array.from(genderFilter),
                        age: Array.from(ageFilter),
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
