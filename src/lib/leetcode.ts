export async function fetchLeetCodeStats(username: string) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username } }),
    next: { revalidate: 0 }, // always fresh
  });

  if (!res.ok) throw new Error("LeetCode API failed");
  const data = await res.json();
  return data.data.matchedUser;
}

// Helper: get today's solved count
export function getTodaySolvedCount(userStats: any) {
  // 🚨 LeetCode doesn't directly give per-day solved stats
  // For now, fallback to total solved count
  // You can track "yesterday’s count" in DB to compute delta
  return (
    userStats.submitStats.acSubmissionNum.find(
      (x: any) => x.difficulty === "All"
    )?.count || 0
  );
}