
import React, { createContext, useContext } from "react";
import type { ModelData } from "@/data/models";

// Distinct palette for up to 8 models (extend if needed)
const PALETTE = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-orange-500",
];

type ModelColorMap = Record<string, string>;

interface ModelColorContextValue {
  getColor: (modelId: string) => string;
}

const ModelColorContext = createContext<ModelColorContextValue>({
  getColor: () => "bg-gray-400",
});

export const useModelColor = () => useContext(ModelColorContext);

export const ModelColorProvider: React.FC<{ models: ModelData[]; children: React.ReactNode }> = ({
  models,
  children,
}) => {
  const colorMap: ModelColorMap = {};
  models.forEach((model, i) => {
    colorMap[model.id] = PALETTE[i % PALETTE.length];
  });

  const getColor = (modelId: string) => colorMap[modelId] || "bg-gray-400";

  return (
    <ModelColorContext.Provider value={{ getColor }}>
      {children}
    </ModelColorContext.Provider>
  );
};

