
import React from "react";
import { useModelColor } from "./ModelColorContext";

interface Props {
  modelId: string;
  value: number;
  max: number;
  height?: number;
}

export const ModelHorizontalBar: React.FC<Props> = ({
  modelId,
  value,
  max,
  height = 14,
}) => {
  const { getColor } = useModelColor();
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div
      className="relative w-full flex items-center"
      style={{ height }}
    >
      <div
        className="absolute w-full rounded-full bg-gray-200"
        style={{ height }}
      />
      <div
        className={`absolute rounded-full transition-all ${getColor(modelId)}`}
        style={{
          width: `${percent}%`,
          height,
        }}
      />
    </div>
  );
};

