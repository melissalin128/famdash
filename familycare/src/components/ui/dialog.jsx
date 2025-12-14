import React, { useEffect, createContext, useContext } from 'react';

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ children, open, onOpenChange, ...props }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center" {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild = false, ...props }) {
  const { onOpenChange } = useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e);
        onOpenChange(true);
      },
      ...props,
    });
  }

  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className = '', ...props }) {
  const { onOpenChange } = useContext(DialogContext);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`relative z-50 grid w-full max-w-lg gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 rounded-lg ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function DialogHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '', ...props }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}

