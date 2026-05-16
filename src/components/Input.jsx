import React from 'react';

// Simple cn utility (fallback in case utils.js is not working)
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default function Input(props) {
  const {
    className,
    label,
    error,
    icon,
    rightElement,
    ...inputProps
  } = props;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 font-heading">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          className={cn(
            'w-full h-10 rounded-xl border-2 border-orange-200 dark:border-stone-600 bg-white dark:bg-stone-800 px-4 py-3 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500',
            'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10 transition-all',
            icon && 'pl-10',
            rightElement && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...inputProps}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}