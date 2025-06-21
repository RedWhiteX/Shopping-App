import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Moon, Sun } from "lucide-react";

import { useTheme } from "./theme_provider";

// --- Placeholder for shadcn/ui components ---
// In a real shadcn/ui setup, these would be imported from your UI library.
// For this example, we provide basic HTML implementations with Tailwind CSS.

// Button component placeholder
const Button = ({ children, onClick, className = "", variant = "default", size = "default", asChild = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = {
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  }[variant];
  const sizeClasses = {
    default: "h-9 px-4 py-2",
    icon: "h-9 w-9",
  }[size];

  if (asChild) {
    return React.cloneElement(children, { onClick, className: `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`, ...props });
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// DropdownMenu context and components placeholder
const DropdownMenuContext = createContext({});

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  const contextValue = { isOpen, toggleOpen, setIsOpen };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children, asChild = false }) => {
  const { toggleOpen } = useContext(DropdownMenuContext);
  if (asChild) {
    return React.cloneElement(children, { onClick: toggleOpen });
  }
  return <button onClick={toggleOpen}>{children}</button>;
};

const DropdownMenuContent = ({ children, align = "end", className = "" }) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  if (!isOpen) return null;

  const alignClasses = align === "end" ? "right-0" : "left-0";

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 mt-2 w-40 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${alignClasses} ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className = "" }) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  const handleClick = (e) => {
    onClick && onClick(e);
    setIsOpen(false);
  };
  return (
    <div
      onClick={handleClick}
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};
// --- End of placeholder components ---


export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
