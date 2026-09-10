/**
 * Quarters, ten weeks each. Weeks past the written curriculum still map to a
 * quarter, so adding weeks 21+ creates its group rather than breaking the
 * grouping.
 */
export const QUARTERS = [
  { id: "q1", label: "1st Quarter", min: 1, max: 10 },
  { id: "q2", label: "2nd Quarter", min: 11, max: 20 },
  { id: "q3", label: "3rd Quarter", min: 21, max: 30 },
  { id: "q4", label: "4th Quarter", min: 31, max: 40 },
];

/** Buckets weeks into quarters, dropping quarters that hold nothing. */
export function groupByQuarter(weeks) {
  return QUARTERS.map((q) => ({
    ...q,
    weeks: weeks.filter((w) => w.weekNumber >= q.min && w.weekNumber <= q.max),
  })).filter((q) => q.weeks.length > 0);
}
