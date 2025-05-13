'use client';

import React from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';

interface ApySparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showSpots?: boolean;
  dayChange: string;
}

const ApySparkline: React.FC<ApySparklineProps> = ({
  data,
  color = 'currentColor',
  height = 30,
  width = 100,
  showSpots = false,
  dayChange
}) => {
  const changeColor = parseFloat(dayChange) >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = parseFloat(dayChange) >= 0 ? '+' : '';
  
  return (
    <div className="flex items-center">
      <Sparklines data={data} width={width} height={height} margin={5}>
        <SparklinesLine
          color={color}
          style={{
            strokeWidth: 2,
            stroke: parseFloat(dayChange) >= 0 ? '#10B981' : '#EF4444',
            fill: "none"
          }}
        />
        {showSpots && (
          <SparklinesSpots
            size={2}
            style={{
              stroke: parseFloat(dayChange) >= 0 ? '#10B981' : '#EF4444',
              strokeWidth: 2,
              fill: "white"
            }}
          />
        )}
      </Sparklines>
      <span className={`ml-2 text-xs font-medium ${changeColor}`}>
        {changeSign}{dayChange}%
      </span>
    </div>
  );
};

export default ApySparkline; 