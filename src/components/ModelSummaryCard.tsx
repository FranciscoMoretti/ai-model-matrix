
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useModelColor } from "./ModelColorContext";
import type { ModelData } from "@/data/models";

interface Props {
  model: ModelData;
  highlight?: string;
  isWinner?: boolean;
}

export const ModelSummaryCard: React.FC<Props> = ({
  model,
  highlight,
  isWinner = false,
}) => {
  const { getColor } = useModelColor();
  return (
    <div className="flex items-center gap-2 mt-0">
      <Badge className={`${getColor(model.id)} text-white px-2 py-1 font-semibold`}>
        {model.name}
      </Badge>
      {isWinner && (
        <span className="inline-flex items-center bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
          <Star className="w-4 h-4 mr-1 text-white inline" strokeWidth={2.5} fill="currentColor" />
          Winner
        </span>
      )}
      {highlight && (
        <span className="text-gray-700 font-medium text-sm">{highlight}</span>
      )}
    </div>
  );
};

