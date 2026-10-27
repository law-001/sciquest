// When each story line rises in as a subtitle, in seconds since the story
// started. A level's play-out time has to leave room for the last line to be read.
const STORY_FIRST_AT = 0.4;
const STORY_STEP = 3.6;

export function storyLinesAt(story, seconds) {
  return story.filter((_, i) => seconds >= STORY_FIRST_AT + i * STORY_STEP);
}
