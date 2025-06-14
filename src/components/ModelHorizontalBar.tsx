
import React from "react";
import { useModelColor } from "./ModelColorContext";

interface Props {
  modelId: string;
  value: number;
  max: number;
  height?: number;
  showDot?: boolean;
}

export const ModelHorizontalBar: React.FC<Props> = ({
  modelId,
  value,
  max,
  height = 12,
  showDot = false,
}) => {
  const { getColor } = useModelColor();
  const percent = max === 0 ? 0 : (value / max) * 100;

  return (
    <div className="relative w-full flex items-center" style={{ height }}>
      {/* Background track */}
      <div 
        className="absolute w-full bg-gray-200 rounded-full" 
        style={{ height }} 
      />
      
      {/* Progress bar */}
      <div
        className={`absolute rounded-full ${getColor(modelId)} transition-all duration-300 ease-out`}
        style={{
          width: `${percent}%`,
          height,
        }}
      />
      
      {showDot && (
        <div
          className={`absolute w-3 h-3 rounded-full ${getColor(modelId)} border-2 border-white shadow-sm`}
          style={{ 
            left: `${percent}%`, 
            top: "50%", 
            transform: "translate(-50%, -50%)" 
          }}
        />
      )}
    </div>
  );
};
