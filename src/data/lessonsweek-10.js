// Week 10: First Periodical Examination — Grade 7 Science
//
// Curriculum source: Grade 7 Science (MATATAG), 1st term Week 10.
//   (FIRST PERIODICAL EXAMINATION)
//
// This week is an examination week: the curriculum assigns no lessons to it.
// `lessons` is intentionally empty. `isWeekFullyCompleted()` in
// src/lib/lessonGating.js treats a lesson-less week as complete so it does not
// permanently lock Week 11 behind a week that has no quiz to submit.

export const week10 = {
  id: "week-10",
  weekNumber: 10,
  title: "First Periodical Examination",
  category: "Assessment",
  description:
    "Examination week covering Weeks 1–9: scientific models, the particle theory, changes of state, investigation and measurement, solubility, concentration, acids and bases, and laboratory safety.",
  icon: "ClipboardCheck",
  color: "primary",
  isLocked: false,
  lessons: [],
};
