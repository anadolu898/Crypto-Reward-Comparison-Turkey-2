'use client';

import React from 'react';

interface ApySparklineProps {
  data: number[];
  height?: number;
  width?: number;
  lineColor?: string;
  fillColor?: string;
}

export default function ApySparkline({
  data,
  height = 30,
  width = 120,
  lineColor = '#0ea5e9',
  fillColor = 'rgba(14, 165, 233, 0.1)'
}: ApySparklineProps) {
  // Return empty space if no data is provided
  if (!data || data.length === 0) {
    return <div style={{ height, width }} />;
  }

  // Find max and min values for scaling
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1; // Prevent division by zero

  // Calculate points for the SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height * 0.8 - height * 0.1; // Leave some margin
    return `${x},${y}`;
  });

  // Create the SVG path
  const path = `M${points.join(' L')}`;
  
  // Create a fill path by extending to the bottom
  const fillPath = `${path} L${width},${height} L0,${height} Z`;

  // Determine if the trend is positive or negative
  const isPositive = data.length > 1 && data[data.length - 1] >= data[0];
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';

  return (
    <div className="relative" style={{ height, width }}>
      <svg width={width} height={height}>
        {/* Fill area under the line */}
        <path d={fillPath} fill={fillColor} />
        
        {/* Line */}
        <path d={path} fill="none" stroke={lineColor} strokeWidth="1.5" />
        
        {/* End point */}
        <circle 
          cx={width} 
          cy={height - ((data[data.length - 1] - min) / range) * height * 0.8 - height * 0.1} 
          r="2" 
          fill={isPositive ? '#10b981' : '#ef4444'} 
        />
      </svg>
      
      {/* Trend indicator */}
      <div className={`absolute top-0 right-0 text-xs ${trendColor}`}>
        {isPositive ? '↗' : '↘'}
      </div>
    </div>
  );
}