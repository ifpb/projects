import React from 'react';

interface BadgeProps {
  url: string;
  value: string;
  className?: string;
}

export default function Badge({ url, value, className = '' }: BadgeProps) {
  return (
    <a
      href={url}
      className={`text-xs font-semibold inline-block uppercase last:mr-0 mr-1 mb-1 py-1 px-2 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-700 hover:text-white transition duration-300 ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {value}
    </a>
  );
}