import { achievementLabel } from '../lib/achievements';

export function AchievementMedal({ achievementKey, locked = false, className = '' }) {
  return <img
    src={`${import.meta.env.BASE_URL}achievements/${achievementKey}.svg`}
    alt={`${achievementLabel(achievementKey)} medal${locked ? ' (locked)' : ''}`}
    width="128"
    height="128"
    className={`${className} object-contain ${locked ? 'grayscale opacity-40' : 'drop-shadow-md'}`}
    draggable={false}
  />;
}
