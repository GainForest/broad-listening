"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import TopicItem, { TDemographics, TTopic } from "./ClaimTopicItem";

export const DisplayTopicsOrDemographics = ({ topics, demographics }: { topics: TTopic[], demographics: TDemographics }) => {
    const [toggleDemographics, setToggleDemographics] = useState<boolean>(false)
    return (
        <div>
            <Button onClick={() => setToggleDemographics(!toggleDemographics)}>Toggle Demographics</Button>
            <div className="flex flex-col border border-border rounded-xl divide-y mt-3">
                {topics.map((topic) => {
                    return (
                        <TopicItem
                            key={topic.title}
                            data={topic}
                            demographics={demographics}
                            toggleDemographics={toggleDemographics}
                        />
                    );
                })}
            </div>
        </div>
    )
}
