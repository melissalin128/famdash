import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const SelectContext = createContext({ 
  value: null, 
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {}
});

export function Select({ children, value, onValueChange, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = '', ...props }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
        <svg
          className="h-4 w-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}

export function SelectValue({ placeholder = 'Select...' }) {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, className = '', ...props }) {
  const { isOpen, setIsOpen, onValueChange } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md top-full mt-1 w-full ${className}`}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child => {
          if (child && child.type === SelectItem) {
            return React.cloneElement(child, {
              onClick: () => {
                onValueChange?.(child.props.value);
                setIsOpen(false);
              },
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function SelectItem({ children, value, className = '', onClick, ...props }) {
  const { value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-slate-100' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

