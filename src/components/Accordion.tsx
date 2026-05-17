import React from 'react';
import { Icon } from '@iconify/react';

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
  className = '',
}: AccordionProps) {
  return (
    <div className={`group ${className}`}>
      <div
        onClick={() => onToggle(id)}
        className={`flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 transition ${
          isOpen ? 'rounded-b-none bg-gray-300' : 'bg-gray-200'
        }`}
      >
        <h1 className="font-semibold text-sm m-0">{title}</h1>
        <Icon
          icon="mdi:chevron-down"
          className={`text-xl transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <nav className="border border-t-0 border-gray-300 rounded-b px-3 py-2 bg-white">
          {children}
        </nav>
      )}
    </div>
  );
}