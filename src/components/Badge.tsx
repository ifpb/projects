import React from "react";

interface BadgeProps {
  url: string;
  value: string;
  className?: string;
}

export default function Badge({ url, value, className = "" }: BadgeProps) {
  return (
    <a
      href={url}
      className={`mr-1 mb-1 inline-block rounded-full border border-green-900/10 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-900 uppercase transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white ${className}`}
    >
      {value}
    </a>
  );
}
