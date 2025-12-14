import React from 'react';

const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-700',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
};

const buttonSizes = {
  default: 'px-4 py-2',
  icon: 'p-2',
  sm: 'px-3 py-1.5 text-sm',
  lg: 'px-6 py-3 text-lg',
};

export function Button({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  asChild = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = buttonVariants[variant] || buttonVariants.default;
  const sizeClasses = buttonSizes[size] || buttonSizes.default;
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${classes} ${children.props.className || ''}`,
      ...props,
    });
  }

  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

