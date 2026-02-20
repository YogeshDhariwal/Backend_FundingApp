export const ACCESS_RANK = {
  Public: 0,
  Basic: 1,
  Pro: 2,
  Premium: 3
};

export const getAccessibleLevels = (planType) => {
  const userRank = ACCESS_RANK[planType];

  return Object.keys(ACCESS_RANK).filter(
    level => ACCESS_RANK[level] <= userRank
  );
};