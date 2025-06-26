import { TTopic } from "./TopicItem";
import { GenderBarChart } from "./GenderBarChart";
import { AgeBarChart } from "./AgeBarChart";
import { TDemographics } from "./utils/fetch-demographics";

const calculateAllTheFemalesAndMales = (
  demographics: TDemographics,
  topic: TTopic
) => {
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
  const maleCount =
    genderData.Male?.filter((id: string) => authorIds.includes(id)).length || 0;
  const femaleCount =
    genderData.Female?.filter((id: string) => authorIds.includes(id)).length ||
    0;

  return {
    male: maleCount,
    female: femaleCount,
  };
};

const calculateAllTheAgeGroups = (
  demographics: TDemographics,
  topic: TTopic
) => {
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

  // Count age groups from demographics
  // Cast to the actual structure since the type definition doesn't match the API response
  const ageData = demographics.age as unknown as Record<string, string[]>;

  const under18 =
    ageData.under_18?.filter((id: string) => authorIds.includes(id)).length ||
    0;
  const age18_25 =
    ageData.age_18_25?.filter((id: string) => authorIds.includes(id)).length ||
    0;
  const age25_35 =
    ageData.age_25_35?.filter((id: string) => authorIds.includes(id)).length ||
    0;
  const age35_55 =
    ageData.age_35_55?.filter((id: string) => authorIds.includes(id)).length ||
    0;
  const over55 =
    ageData.over_55?.filter((id: string) => authorIds.includes(id)).length || 0;

  return {
    under18,
    age18_25,
    age25_35,
    age35_55,
    over55,
  };
};

export const ClaimStatistics = ({
  demographics,
  data,
}: {
  demographics: TDemographics;
  data: TTopic;
}) => {
  const { male, female } = calculateAllTheFemalesAndMales(demographics, data);
  const ageData = calculateAllTheAgeGroups(demographics, data);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
        <GenderBarChart male={male} female={female} />
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
        <AgeBarChart
          under18={ageData.under18}
          age18_25={ageData.age18_25}
          age25_35={ageData.age25_35}
          age35_55={ageData.age35_55}
          over55={ageData.over55}
        />
      </div>
    </div>
  );
};
