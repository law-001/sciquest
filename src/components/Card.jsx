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
        'bg-white rounded-2xl border border-orange-100 shadow-card overflow-hidden',
        hoverable && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}