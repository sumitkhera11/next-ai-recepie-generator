export function calculateUsage(currentUsage, lastUsageDate, limit) {

  const today = new Date().toLocaleDateString("en-CA")

  if (lastUsageDate !== today) {
    currentUsage = 0;
  }

  if (currentUsage >= limit) {
    return {
      allowed: false,
      currentUsage,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    currentUsage,
    remaining: limit - currentUsage,
  };
}