// post query builder
export const postQueryBuilder = (query = {}) => {
  const matchStage = {};

  if (query.isClaimed === "true") {
    matchStage.isClaimed = true;
  }

  if (query.isClaimed === "false") {
    matchStage.isClaimed = { $ne: true };
  }

  console.log("matchStage", matchStage);
  return Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : [];
};

// claim query builder
export const claimQueryBuilder = (query = {}) => {
  const matchStage = {};

  if (query.status) {
    matchStage.status = query.status;
  }

  // Handle stage filter including exclusion
  if (query.stage) {
    if (query.stage === "!admin") {
      matchStage.stage = { $ne: "admin" };
    } else {
      matchStage.stage = query.stage;
    }
  }

  // Optional: filter by claimedBy (user ID)
  if (query.claimedBy) {
    matchStage.claimedBy = query.claimedBy;
  }

  console.log("Claim MatchStage:", matchStage);
  return matchStage;
};
