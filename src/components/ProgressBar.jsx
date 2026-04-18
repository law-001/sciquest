import React from 'react';

import { cn } from '../lib/utils';

export default function ProgressBar({
  progress,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
}) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-500',
  };

  const bgColors = {
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    accent: 'bg-accent-100',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-stone-600 font-heading">
            Progress
          </span>
          <span className="text-xs font-bold text-stone-600 font-heading">
            {clampedProgress}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          bgColors[color],
          sizes[size]
        )}
      >
        <div
          className={cn('progress-bar-fill', colors[color])}
          style={{
            width: `${clampedProgress}%`,
          }}
        />
      </div>
    </div>
  );
}