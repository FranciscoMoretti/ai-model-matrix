
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
    <div className="flex items-center gap-2">
      {isWinner && (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-2 py-1 text-xs">
          <Star className="w-3 h-3 mr-1" />
          Winner
        </Badge>
      )}
      <Badge 
        className={`${getColor(model.id)} hover:opacity-90 text-white px-2 py-1 font-medium text-xs`}
      >
        {model.name}
      </Badge>
      {highlight && (
        <span className="text-gray-600 text-sm font-medium">{highlight}</span>
      )}
    </div>
  );
};
