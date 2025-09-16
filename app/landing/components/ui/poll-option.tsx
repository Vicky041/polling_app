'use client';

import React from 'react';
import { PollOption as PollOptionType } from '../../types';

interface PollOptionProps {
  option: PollOptionType;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    progress: 'bg-blue-500',
    progressBg: 'bg-blue-200',
    text: 'text-blue-600'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    progress: 'bg-purple-500',
    progressBg: 'bg-purple-200',
    text: 'text-purple-600'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    progress: 'bg-green-500',
    progressBg: 'bg-green-200',
    text: 'text-green-600'
  }
} as const;

/**
 * Reusable poll option component for displaying poll results
 */
export function PollOptionComponent({ option }: PollOptionProps) {
  const colors = colorMap[option.color as keyof typeof colorMap];
  
  return (
    <div className={`flex items-center justify-between p-3 ${colors.bg} rounded-lg border ${colors.border}`}>
      <span className="font-medium text-gray-700">{option.label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-20 h-2 ${colors.progressBg} rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${colors.progress} rounded-full transition-all duration-500`}
            style={{ width: `${option.percentage}%` }}
          />
        </div>
        <span className={`text-sm font-semibold ${colors.text}`}>
          {option.percentage}%
        </span>
      </div>
    </div>
  );
}