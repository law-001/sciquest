import React, { forwardRef } from 'react';

// Simple cn utility (fallback in case utils.js is not working)
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default function Input(props, ref) {
  const { 
    className, 
    label, 
    error, 
    icon, 
    ...inputProps 
  } = props;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-stone-700 mb-1.5 font-heading">
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
          ref={ref}
          className={cn(
            'w-full h-10 rounded-xl border-2 border-orange-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400',
            'focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...inputProps}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500 font-medium animate-slide-up">
          {error}
        </p>
      )}
    </div>
  );
}