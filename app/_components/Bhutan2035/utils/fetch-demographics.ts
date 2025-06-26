export type TDemographics = Record<
  string,
  {
    ageGroup?: "<18" | "18-25" | "25-35" | "35-55" | "55+";
    gender?: "male" | "female";
  }
>;

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use the current origin
    return window.location.origin;
  }
  // Server-side: use environment variable or default to localhost:3000
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

const fetchDemographics = async () => {
  const baseUrl = getBaseUrl();

  const [genderData, ageData] = await Promise.all([
    fetch(`${baseUrl}/api/profile/gender-groups`),
    fetch(`${baseUrl}/api/profile/age-groups`),
  ]);

  const genderJson = await genderData.json();
  const ageJson = await ageData.json();

  const demographics: TDemographics = {};

  genderJson.Male.forEach((userId: string) => {
    demographics[userId] = { gender: "male", ...(demographics[userId] ?? {}) };
  });
  genderJson.Female.forEach((userId: string) => {
    demographics[userId] = {
      gender: "female",
      ...(demographics[userId] ?? {}),
    };
  });

  ageJson.under_18.forEach((userId: string) => {
    demographics[userId] = { ageGroup: "<18", ...(demographics[userId] ?? {}) };
  });
  ageJson.age_18_25.forEach((userId: string) => {
    demographics[userId] = {
      ageGroup: "18-25",
      ...(demographics[userId] ?? {}),
    };
  });
  ageJson.age_25_35.forEach((userId: string) => {
    demographics[userId] = {
      ageGroup: "25-35",
      ...(demographics[userId] ?? {}),
    };
  });
  ageJson.age_35_55.forEach((userId: string) => {
    demographics[userId] = {
      ageGroup: "35-55",
      ...(demographics[userId] ?? {}),
    };
  });
  ageJson.over_55.forEach((userId: string) => {
    demographics[userId] = { ageGroup: "55+", ...(demographics[userId] ?? {}) };
  });

  return demographics;
};

export default fetchDemographics;
