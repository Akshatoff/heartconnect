interface Profile {
  id: string;
  interests: string[];
  location: string;
  age: number;
  disability_type?: string;
}

export const calculateCompatibilityScore = (
  userProfile: Profile,
  otherProfile: Profile,
): number => {
  let score = 0;

  // Interest matching (40% weight)
  const commonInterests = userProfile.interests.filter((interest) =>
    otherProfile.interests.includes(interest),
  );
  const interestScore =
    (commonInterests.length / Math.max(userProfile.interests.length, 1)) * 40;
  score += interestScore;

  // Location proximity (30% weight)
  const sameLocation = userProfile.location === otherProfile.location;
  const locationScore = sameLocation ? 30 : 15;
  score += locationScore;

  // Age compatibility (20% weight)
  const ageDiff = Math.abs(userProfile.age - otherProfile.age);
  const ageScore = Math.max(0, 20 - ageDiff * 2);
  score += ageScore;

  // Similar challenges bonus (10% weight)
  if (userProfile.disability_type && otherProfile.disability_type) {
    if (userProfile.disability_type === otherProfile.disability_type) {
      score += 10;
    }
  }

  return Math.round(Math.min(score, 100));
};

export const sortMatchesByCompatibility = (
  userProfile: Profile,
  matches: Profile[],
): Profile[] => {
  return matches
    .map((match) => ({
      ...match,
      compatibilityScore: calculateCompatibilityScore(userProfile, match),
    }))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

export const filterMatches = (
  matches: Profile[],
  filters: {
    minAge?: number;
    maxAge?: number;
    location?: string;
    interests?: string[];
  },
): Profile[] => {
  return matches.filter((match) => {
    if (filters.minAge && match.age < filters.minAge) return false;
    if (filters.maxAge && match.age > filters.maxAge) return false;
    if (filters.location && match.location !== filters.location) return false;
    if (filters.interests && filters.interests.length > 0) {
      const hasCommonInterest = filters.interests.some((interest) =>
        match.interests.includes(interest),
      );
      if (!hasCommonInterest) return false;
    }
    return true;
  });
};
