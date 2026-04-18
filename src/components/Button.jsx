// components/Button.jsx
import React from 'react';

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600",
    ghost: "text-primary-600 hover:bg-primary-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `.trim()}
      {...props}
    >
      {leftIcon && <span>{leftIcon}</span>}
      {children}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;