import { achievementLabel } from '../lib/achievements';

export function AchievementMedal({ achievementKey, locked = false, className = '' }) {
  return <img
    src={`${import.meta.env.BASE_URL}achievements/${achievementKey}.png`}
    alt={`${achievementLabel(achievementKey)} achievement${locked ? ' (locked)' : ''}`}
    width="128"
    height="128"
    className={`${className} object-contain ${locked ? 'grayscale opacity-40' : ''}`}
    draggable={false}
  />;
}
