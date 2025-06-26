"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TDemographics, TTopic } from "./ClaimTopicItem";

export const DisplayTopicsOrDemographics = ({ topics, demographics }: { topics: TTopic[], demographics: TDemographics }) => {
    const [toggleDemographics, setToggleDemographics] = useState<boolean>(false)
    return (
        <div>
            <Button onClick={() => setToggleDemographics(!toggleDemographics)}>Toggle Demographics</Button>
            <h3>{toggleDemographics ? "Demographics" : "Topics"}</h3>
        </div>
    )
}