export const invalidateDashboardQueries = async (
  queryClient,
  userId,
  options = {},
) => {
  const { includeSkills = false, includeTracks = false } = options;

  if (!userId) {
    console.warn("[invalidateDashboardQueries] No userId provided");
    return;
  }

  const queries = [
    ["dashboard", "currentFocus", userId],
    ["dashboard", "weeklyProgress", userId],
    ["dashboard", "keyMetrics", userId],
    ["dashboard", "recentActivities", userId],
    ["dashboard", "dailyActivity", userId],
  ];

  if (includeSkills) {
    queries.push(["dashboard", "skills", userId]);
  }

  if (includeTracks) {
    queries.push(["dashboard", "tracks", userId]);
  }

  await Promise.allSettled(
    queries.map((q) =>
      queryClient.invalidateQueries({ queryKey: q, exact: false }),
    ),
  );
};

export default invalidateDashboardQueries;
