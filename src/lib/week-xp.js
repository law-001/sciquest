// Max XP a student can earn from a week: each lesson's completion XP plus the
// best possible XP from that lesson's quiz. Derived from the real data so the
// "+N XP" badge always matches what the XP engine actually awards.

import { getQuizByLesson } from "../data/quizzesweek-01";
import { maxQuizXp } from "./xp-config";

export function weekMaxXp(week) {
  return (week.lessons ?? []).reduce((sum, lesson) => {
    const lessonXp = lesson.xp ?? 0;
    return sum + lessonXp + maxQuizXp(getQuizByLesson(lesson.id));
  }, 0);
}
