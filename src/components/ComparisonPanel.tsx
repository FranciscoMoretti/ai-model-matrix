
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModelData, getProviderColor } from '@/data/models';
import { X, Brain, Zap, FileText, Image, Mic, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComparisonPanelProps {
  models: ModelData[];
  onRemoveModel: (modelId: string) => void;
  onClearAll: () => void;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ 
  models, 
  onRemoveModel, 
  onClearAll 
}) => {
  const navigate = useNavigate();

  if (models.length === 0) return null;

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(3)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const handleGoToCompare = () => {
    const modelIds = models.map(m => m.id).join(',');
    navigate(`/comparison?models=${modelIds}`);
  };

  return (
    <div className="fixed bottom-6 right-6 max-w-4xl w-full mx-6 z-50">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Model Comparison ({models.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleGoToCompare} className="bg-blue-600 hover:bg-blue-700">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Compare
              </Button>
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
            {models.map((model) => (
              <div key={model.id} className="relative bg-gray-50 rounded-lg p-4 border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-6 h-6 p-0"
                  onClick={() => onRemoveModel(model.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={`${getProviderColor(model.specification.provider)} text-white text-xs`}
                      >
                        {model.specification.provider.toUpperCase()}
                      </Badge>
                      {model.features.reasoning && (
                        <Badge variant="outline" className="text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm">{model.name}</h3>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input:</span>
                      <span className="font-medium">{formatPrice(model.pricing.inputMTok)}/M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output:</span>
                      <span className="font-medium">{formatPrice(model.pricing.outputMTok)}/M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Context:</span>
                      <span className="font-medium">
                        {formatContextWindow(model.features.contextWindow.input)}
                      </span>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1">
                    {model.features.input.image && <Image className="w-3 h-3 text-blue-500" />}
                    {model.features.input.audio && <Mic className="w-3 h-3 text-green-500" />}
                    {model.features.output.audio && <Volume2 className="w-3 h-3 text-purple-500" />}
                    {model.features.functionCalling && <Zap className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonPanel;
