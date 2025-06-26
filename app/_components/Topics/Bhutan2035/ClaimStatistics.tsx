import { Mars, Venus } from "lucide-react"
import { TDemographics, TTopic } from "./ClaimTopicItem"
import { GenderBarChart } from "./GenderBarChart"


const calculateAllTheFemalesAndMales = (demographics: TDemographics, topic: TTopic) => {
    const people = new Set<string>();
    topic.subtopics.forEach((subtopic) => {
        subtopic.claims.forEach((claim) => {
            claim.quotes.forEach((quote) => {
                people.add(quote.authorId);
            });
        });
    });
    
    // Get the author IDs from the topic
    const authorIds = Array.from(people);
    
    // Count males and females from demographics
    // Cast to the actual structure since the type definition doesn't match the API response
    const genderData = demographics.gender as unknown as Record<string, string[]>;
    const maleCount = genderData.Male?.filter((id: string) => authorIds.includes(id)).length || 0;
    const femaleCount = genderData.Female?.filter((id: string) => authorIds.includes(id)).length || 0;
    
    return {
        male: maleCount,
        female: femaleCount
    };
};

export const ClaimStatistics = ({demographics, data}: {demographics: TDemographics, data: TTopic}) => {
    const { male, female } = calculateAllTheFemalesAndMales(demographics, data);
    
    return (
        <div className="space-y-3">            
            <GenderBarChart male={male} female={female} />
        </div>
    )
}