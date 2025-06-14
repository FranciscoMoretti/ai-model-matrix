
import React from "react";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Star } from "lucide-react";
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
    <div className="flex items-center gap-2 mt-1 mb-1">
      {isWinner && (
        <Badge className="bg-yellow-500 text-white font-bold px-2 py-1">
          <Star className="w-4 h-4 mr-1 inline" />
          Winner
        </Badge>
      )}
      <Badge className={`${getColor(model.id)} text-white px-2 py-1 font-semibold`}>{model.name}</Badge>
      <span className="text-gray-700 font-medium text-sm">{highlight}</span>
    </div>
  );
};
