
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
  height = 15,
  showDot = false,
}) => {
  const { getColor } = useModelColor();
  const percent = max === 0 ? 0 : (value / max) * 100;

  return (
    <div className="relative w-full flex items-center" style={{ height }}>
      <div className="absolute rounded-full w-full bg-gray-200" style={{ height }} />
      <div
        className={`absolute rounded-full ${getColor(modelId)}`}
        style={{ width: "100%", height, opacity: 0.1 }}
      />
      <div
        className={`relative rounded-full ${getColor(modelId)} transition-all`}
        style={{
          width: "100%",
          maxWidth: "100%",
          height,
          clipPath: `inset(0 ${100 - percent}% 0 0)`,
        }}
      />
      {showDot && (
        <div
          className={`absolute right-0 w-3 h-3 rounded-full ${getColor(modelId)}`}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        />
      )}
    </div>
  );
};
