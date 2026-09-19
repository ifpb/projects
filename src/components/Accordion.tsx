import React from "react";

interface AccordionProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export default function Accordion({
  id,
  title,
  isOpen,
  onToggle,
  children,
  className = "",
}: AccordionProps) {
  return (
    <div className={`group ${className}`}>
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className={`flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors ${
          isOpen
            ? "rounded-b-none border-gray-300 bg-gray-100"
            : "border-gray-200 bg-white hover:border-green-600"
        }`}
      >
        <span className="m-0 text-sm font-bold text-gray-800">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`text-xl transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z" />
        </svg>
      </button>
      {isOpen && (
        <nav
          id={`${id}-content`}
          className="rounded-b-md border border-t-0 border-gray-300 bg-white px-3 py-3"
        >
          {children}
        </nav>
      )}
    </div>
  );
}
