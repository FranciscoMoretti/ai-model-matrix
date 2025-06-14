
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { enabledModels, ModelData, getProviderColor } from '@/data/models';
import { ArrowLeft, Brain, Zap, FileText, Image, Mic, Volume2, DollarSign } from 'lucide-react';

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const modelIds = searchParams.get('models')?.split(',') || [];
  
  const models = modelIds
    .map(id => enabledModels.find(model => model.id === id))
    .filter(Boolean) as ModelData[];

  if (models.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No models to compare</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Models
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatContextWindow = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}K`;
    return tokens.toString();
  };

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(3)}`;
    return `$${price.toFixed(2)}`;
  };

  const maxInputPrice = Math.max(...models.map(m => m.pricing.inputMTok));
  const maxOutputPrice = Math.max(...models.map(m => m.pricing.outputMTok));
  const maxInputContext = Math.max(...models.map(m => m.features.contextWindow.input));
  const maxOutputContext = Math.max(...models.map(m => m.features.contextWindow.output));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Models
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Model Comparison</h1>
                <p className="text-gray-600">{models.length} models selected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Model Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {models.map((model) => (
            <Card key={model.id} className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center gap-2 mb-2">
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
                <CardTitle className="text-xl">{model.name}</CardTitle>
                <p className="text-sm text-gray-600">{model.shortDescription}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Detailed Comparison Sections */}
        <div className="space-y-8">
          {/* Pricing Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Price Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Input Pricing (per 1M tokens)</h4>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-input`} className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                          <Progress 
                            value={(model.pricing.inputMTok / maxInputPrice) * 100} 
                            className="flex-1" 
                          />
                          <span className="text-sm font-semibold min-w-[4rem] text-right">
                            {formatPrice(model.pricing.inputMTok)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Output Pricing (per 1M tokens)</h4>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-output`} className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                          <Progress 
                            value={(model.pricing.outputMTok / maxOutputPrice) * 100} 
                            className="flex-1" 
                          />
                          <span className="text-sm font-semibold min-w-[4rem] text-right">
                            {formatPrice(model.pricing.outputMTok)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context Window Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Context Window
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Input Context</h4>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-input-context`} className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                          <Progress 
                            value={(model.features.contextWindow.input / maxInputContext) * 100} 
                            className="flex-1" 
                          />
                          <span className="text-sm font-semibold min-w-[4rem] text-right">
                            {formatContextWindow(model.features.contextWindow.input)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Output Context</h4>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-output-context`} className="flex items-center justify-between">
                        <span className="font-medium">{model.name}</span>
                        <div className="flex items-center gap-3 flex-1 max-w-md">
                          <Progress 
                            value={(model.features.contextWindow.output / maxOutputContext) * 100} 
                            className="flex-1" 
                          />
                          <span className="text-sm font-semibold min-w-[4rem] text-right">
                            {formatContextWindow(model.features.contextWindow.output)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Feature</th>
                      {models.map((model) => (
                        <th key={model.id} className="text-center py-3 px-4 min-w-[120px]">
                          {model.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">Reasoning</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center">
                          {model.features.reasoning ? (
                            <Brain className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Function Calling</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center">
                          {model.features.functionCalling ? (
                            <Zap className="w-5 h-5 text-blue-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Image Input</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center">
                          {model.features.input.image ? (
                            <Image className="w-5 h-5 text-purple-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Audio Input</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center">
                          {model.features.input.audio ? (
                            <Mic className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Audio Output</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center">
                          {model.features.output.audio ? (
                            <Volume2 className="w-5 h-5 text-orange-500 mx-auto" />
                          ) : (
                            <span className="text-gray-400">−</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Knowledge Cutoff</td>
                      {models.map((model) => (
                        <td key={model.id} className="py-3 px-4 text-center text-sm">
                          {model.features.knowledgeCutoff.toLocaleDateString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
