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
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Claims</h2>
        <div className="flex items-center justify-between">
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
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm font-medium text-muted-foreground">Filters</span>
            <Switch
              checked={mode === "demographics"}
              onCheckedChange={() =>
                setMode(mode === "demographics" ? "topics" : "demographics")
              }
            />
          </label>
        </div>
      </div>

      {mode === "demographics" && (
        <div className="bg-muted/20 border border-border rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Gender</h3>
              <div className="flex gap-2">
                <button
                  className={cn(
                    "px-3 py-2 text-xs font-medium rounded-md border transition-all",
                    genderFilter.has("male")
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-background border-border text-muted-foreground hover:border-border/80"
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
                    "px-3 py-2 text-xs font-medium rounded-md border transition-all",
                    genderFilter.has("female")
                      ? "bg-pink-50 border-pink-200 text-pink-700"
                      : "bg-background border-border text-muted-foreground hover:border-border/80"
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
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Age Groups</h3>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((age) => {
                  return (
                    <button
                      key={age}
                      className={cn(
                        "px-3 py-2 text-xs font-medium rounded-md border transition-all",
                        ageFilter.has(age)
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-background border-border text-muted-foreground hover:border-border/80"
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
        </div>
      )}

      <div className="space-y-4">
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
    </section>
  );
};
