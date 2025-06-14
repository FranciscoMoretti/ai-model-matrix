
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { enabledModels, ModelData } from '@/data/models';
import { ArrowLeft, Brain, Zap, FileText, Image, Mic, Volume2, DollarSign, Star, Crown, TrendingDown, Maximize } from 'lucide-react';
import { ModelColorProvider } from "@/components/ModelColorContext";
import { ModelHorizontalBar } from "@/components/ModelHorizontalBar";

// Formatting helpers
const formatContextWindow = (tokens: number) => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
};

const formatPrice = (price: number) => {
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
};

const Comparison = () => {
  const [searchParams] = useSearchParams();
  const modelIds = searchParams.get('models')?.split(',') || [];
  const models = modelIds
    .map(id => enabledModels.find(model => model.id === id))
    .filter(Boolean) as ModelData[];

  if (models.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  // Calculate max values for normalized bar widths
  const maxInputPrice = Math.max(...models.map(m => m.pricing.inputMTok));
  const maxOutputPrice = Math.max(...models.map(m => m.pricing.outputMTok));
  const maxInputContext = Math.max(...models.map(m => m.features.contextWindow.input));
  const maxOutputContext = Math.max(...models.map(m => m.features.contextWindow.output));

  // "Winner" logic for summaries
  const minInputPrice = Math.min(...models.map((m) => m.pricing.inputMTok));
  const minOutputPrice = Math.min(...models.map((m) => m.pricing.outputMTok));
  const maxContextWindow = Math.max(...models.map((m) => m.features.contextWindow.input));

  // Model advantage generator
  const getModelAdvantages = (model: ModelData) => {
    const advantages: Array<{ text: string; icon: React.ReactNode; color: string }> = [];
    
    if (model.pricing.inputMTok === minInputPrice) {
      advantages.push({
        text: "Best input pricing",
        icon: <TrendingDown className="w-3 h-3" />,
        color: "text-green-600 bg-green-50 border-green-200"
      });
    }
    
    if (model.pricing.outputMTok === minOutputPrice) {
      advantages.push({
        text: "Best output pricing", 
        icon: <TrendingDown className="w-3 h-3" />,
        color: "text-green-600 bg-green-50 border-green-200"
      });
    }
    
    if (model.features.contextWindow.input === maxContextWindow) {
      advantages.push({
        text: "Largest context window",
        icon: <Maximize className="w-3 h-3" />,
        color: "text-blue-600 bg-blue-50 border-blue-200"
      });
    }
    
    return advantages;
  };

  return (
    <ModelColorProvider models={models}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Models
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Model Comparison</h1>
                <p className="text-gray-600 mt-1">{models.length} models selected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Model Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {models.map((model) => {
              const advantages = getModelAdvantages(model);
              return (
                <Card key={model.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Model Header */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-white text-xs px-2 py-1 uppercase font-medium tracking-wide ${
                            model.specification.provider === 'anthropic' ? 'bg-orange-500' :
                            model.specification.provider === 'google' ? 'bg-blue-500' :
                            model.specification.provider === 'openai' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`}>
                            {model.specification.provider}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{model.shortDescription}</p>
                      </div>
                      
                      {/* Pricing Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Input</div>
                          <div className="text-lg font-bold text-gray-900">{formatPrice(model.pricing.inputMTok)}/1M tokens</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Output</div>
                          <div className="text-lg font-bold text-gray-900">{formatPrice(model.pricing.outputMTok)}/1M tokens</div>
                        </div>
                      </div>

                      {/* Context Window */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">Context Window</div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Input: <span className="font-bold text-gray-900">{formatContextWindow(model.features.contextWindow.input)}</span></span>
                          <span className="text-sm font-medium text-gray-700">Output: <span className="font-bold text-gray-900">{formatContextWindow(model.features.contextWindow.output)}</span></span>
                        </div>
                      </div>

                      {/* Input Capabilities */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Input Capabilities</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded">
                            <FileText className="w-3 h-3" />
                            Text
                          </div>
                          {model.features.input.image && (
                            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              <Image className="w-3 h-3" />
                              Image
                            </div>
                          )}
                          {model.features.input.pdf && (
                            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              <FileText className="w-3 h-3" />
                              PDF
                            </div>
                          )}
                          {model.features.input.audio && (
                            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              <Mic className="w-3 h-3" />
                              Audio
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Output Capabilities */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Output Capabilities</div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded">
                            <FileText className="w-3 h-3" />
                            Text
                          </div>
                          {model.features.output.audio && (
                            <div className="flex items-center gap-1 text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                              <Volume2 className="w-3 h-3" />
                              Audio
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Features</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Function Calling</span>
                            {model.features.functionCalling ? (
                              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Zap className="w-3 h-3 text-green-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Reasoning</span>
                            {model.features.reasoning ? (
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                                <Brain className="w-3 h-3 text-blue-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Updated</span>
                            <span className="text-xs text-gray-500">{model.features.knowledgeCutoff.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Advantages */}
                      {advantages.length > 0 && (
                        <div className="space-y-2">
                          {advantages.map((advantage, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${advantage.color}`}
                            >
                              {advantage.icon}
                              <span className="text-xs font-medium">{advantage.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Comparison Sections */}
          <div className="space-y-8">
            {/* Price Comparison */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-10">
                  {/* Input Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Input Pricing</h3>
                    <p className="text-sm text-gray-500 mb-6">per 1M tokens</p>
                    <div className="space-y-5">
                      {models.map((model, index) => (
                        <div key={`${model.id}-input`} className="flex items-center gap-6">
                          <div className="w-36 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.pricing.inputMTok}
                              max={maxInputPrice}
                              height={16}
                            />
                          </div>
                          <div className="w-20 text-right text-sm font-bold text-gray-900">
                            {formatPrice(model.pricing.inputMTok)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Output Pricing</h3>
                    <p className="text-sm text-gray-500 mb-6">per 1M tokens</p>
                    <div className="space-y-5">
                      {models.map((model, index) => (
                        <div key={`${model.id}-output`} className="flex items-center gap-6">
                          <div className="w-36 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.pricing.outputMTok}
                              max={maxOutputPrice}
                              height={16}
                            />
                          </div>
                          <div className="w-20 text-right text-sm font-bold text-gray-900">
                            {formatPrice(model.pricing.outputMTok)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Context Window */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Context Window
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-10">
                  {/* Input Context */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Input Context</h3>
                    <div className="space-y-5">
                      {models.map((model, index) => (
                        <div key={`${model.id}-input-context`} className="flex items-center gap-6">
                          <div className="w-36 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.features.contextWindow.input}
                              max={maxInputContext}
                              height={16}
                            />
                          </div>
                          <div className="w-20 text-right text-sm font-bold text-gray-900">
                            {formatContextWindow(model.features.contextWindow.input)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Output Context */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Output Context</h3>
                    <div className="space-y-5">
                      {models.map((model, index) => (
                        <div key={`${model.id}-output-context`} className="flex items-center gap-6">
                          <div className="w-36 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.features.contextWindow.output}
                              max={maxOutputContext}
                              height={16}
                            />
                          </div>
                          <div className="w-20 text-right text-sm font-bold text-gray-900">
                            {formatContextWindow(model.features.contextWindow.output)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Comparison */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                        {models.map((model) => (
                          <th key={model.id} className="text-center py-4 px-6 font-semibold text-gray-900 min-w-[140px]">
                            {model.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Reasoning</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center">
                            {model.features.reasoning ? (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <Brain className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Function Calling</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center">
                            {model.features.functionCalling ? (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                                <Zap className="w-4 h-4 text-blue-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Image Input</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center">
                            {model.features.input.image ? (
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                                <Image className="w-4 h-4 text-purple-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Audio Input</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center">
                            {model.features.input.audio ? (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <Mic className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Audio Output</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center">
                            {model.features.output.audio ? (
                              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                                <Volume2 className="w-4 h-4 text-orange-600" />
                              </div>
                            ) : (
                              <span className="text-gray-300 text-lg">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-gray-25">
                        <td className="py-5 px-6 font-medium text-gray-700">Knowledge Cutoff</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-5 px-6 text-center text-sm text-gray-600 font-medium">
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
    </ModelColorProvider>
  );
};

export default Comparison;
