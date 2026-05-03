import React from 'react';

import { cn } from '../lib/utils';

export default function Card({
  className,
  hoverable = false,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-stone-800 rounded-2xl border border-orange-100 dark:border-stone-700 shadow-card overflow-hidden',
        hoverable && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}