
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModelData, getProviderColor, getProviderGradient } from '@/data/models';
import { Plus, Brain, Eye, FileText, Volume2, Image, Mic } from 'lucide-react';

interface ModelCardProps {
  model: ModelData;
  onCompare?: (model: ModelData) => void;
  isComparing?: boolean;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onCompare, isComparing = false }) => {
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

  const inputCapabilities = [];
  if (model.features.input.text) inputCapabilities.push({ icon: FileText, label: 'Text' });
  if (model.features.input.image) inputCapabilities.push({ icon: Image, label: 'Image' });
  if (model.features.input.pdf) inputCapabilities.push({ icon: FileText, label: 'PDF' });
  if (model.features.input.audio) inputCapabilities.push({ icon: Mic, label: 'Audio' });

  const outputCapabilities = [];
  if (model.features.output.text) outputCapabilities.push({ icon: FileText, label: 'Text' });
  if (model.features.output.image) outputCapabilities.push({ icon: Image, label: 'Image' });
  if (model.features.output.audio) outputCapabilities.push({ icon: Volume2, label: 'Audio' });

  return (
    <Card className="relative h-full hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-white to-gray-50">
      <div className={`absolute inset-0 bg-gradient-to-br ${getProviderGradient(model.specification.provider)} opacity-5 rounded-lg`}></div>
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={`${getProviderColor(model.specification.provider)} text-white text-xs`}
              >
                {model.specification.provider.toUpperCase()}
              </Badge>
              {model.features.reasoning && (
                <Badge variant="outline" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  Reasoning
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {model.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {model.shortDescription}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompare?.(model)}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isComparing}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Pricing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/80 rounded-lg p-3 border">
            <div className="text-xs text-gray-500 mb-1">Input</div>
            <div className="font-semibold text-sm">
              {formatPrice(model.pricing.inputMTok)}/1M tokens
            </div>
          </div>
          <div className="bg-white/80 rounded-lg p-3 border">
            <div className="text-xs text-gray-500 mb-1">Output</div>
            <div className="font-semibold text-sm">
              {formatPrice(model.pricing.outputMTok)}/1M tokens
            </div>
          </div>
        </div>

        {/* Context Window */}
        <div className="bg-white/80 rounded-lg p-3 border">
          <div className="text-xs text-gray-500 mb-2">Context Window</div>
          <div className="flex items-center justify-between text-sm">
            <span>Input: <strong>{formatContextWindow(model.features.contextWindow.input)}</strong></span>
            <span>Output: <strong>{formatContextWindow(model.features.contextWindow.output)}</strong></span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-2">Input Capabilities</div>
            <div className="flex flex-wrap gap-1">
              {inputCapabilities.map(({ icon: Icon, label }) => (
                <Badge key={label} variant="outline" className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-2">Output Capabilities</div>
            <div className="flex flex-wrap gap-1">
              {outputCapabilities.map(({ icon: Icon, label }) => (
                <Badge key={label} variant="outline" className="text-xs">
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="flex flex-wrap gap-1">
          {model.features.functionCalling && (
            <Badge variant="secondary" className="text-xs">Function Calling</Badge>
          )}
          <Badge variant="secondary" className="text-xs">
            Updated {model.features.knowledgeCutoff.toLocaleDateString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
