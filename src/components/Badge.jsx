import React from 'react';

import { cn } from '../lib/utils';

export default function Badge({
  className,
  variant = 'primary',
  icon,
  children,
  ...props
}) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    accent: 'bg-accent-100 text-accent-700 border-accent-200',
    outline: 'bg-white text-stone-600 border-orange-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-heading border',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
}