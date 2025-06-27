export type TDemographics = Record<
  string,
  {
    ageGroup?: "<18" | "18-25" | "25-35" | "35-55" | "55+";
    gender?: "male" | "female";
    // location?: string;
  }
>;

const getBaseUrl = () => {
  return "https://bhutan.deepgov.org";
};

const fetchDemographics = async () => {
  const baseUrl = getBaseUrl();

  const [
    genderData,
    ageData,
    // locationData
  ] = await Promise.all([
    fetch(`${baseUrl}/api/profile/gender-groups`),
    fetch(`${baseUrl}/api/profile/age-groups`),
    // fetch(`${baseUrl}/api/profile/location-groups`),
  ]);

  const genderJson = await genderData.json();
  const ageJson = await ageData.json();
  console.log(
    genderData,
    ageData,
    // locationData,
    "genderData, ageData, locationData"
  );
  // const locationJson = await locationData.json();

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

  // Object.keys(locationJson).forEach((key) => {
  //   const locationKey = key as keyof typeof locationJson;
  //   locationJson[locationKey as keyof typeof locationJson].forEach(
  //     (userId: string) => {
  //       demographics[userId] = {
  //         location: locationKey as string,
  //         ...(demographics[userId] ?? {}),
  //       };
  //     }
  //   );
  // });

  return demographics;
};

export default fetchDemographics;
