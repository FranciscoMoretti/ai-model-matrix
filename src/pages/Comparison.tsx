
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { enabledModels, ModelData } from '@/data/models';
import { ArrowLeft, Brain, Zap, FileText, Image, Mic, Volume2, DollarSign, Star } from 'lucide-react';
import { ModelColorProvider } from "@/components/ModelColorContext";
import { ModelHorizontalBar } from "@/components/ModelHorizontalBar";
import { ModelSummaryCard } from "@/components/ModelSummaryCard";

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

  // Model highlight generator
  const getHighlights = (model: ModelData) => {
    const highlights: string[] = [];
    if (model.pricing.inputMTok === minInputPrice)
      highlights.push("Lowest input price");
    if (model.pricing.outputMTok === minOutputPrice)
      highlights.push("Lowest output price");
    if (model.features.contextWindow.input === maxContextWindow)
      highlights.push("Largest context window");
    return highlights;
  };

  return (
    <ModelColorProvider models={models}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
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
          {/* Model Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {models.map((model) => {
              const highlights = getHighlights(model);
              return (
                <Card key={model.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{model.shortDescription}</p>
                      </div>
                      
                      <div className="space-y-2">
                        {highlights.map((highlight, idx) => (
                          <ModelSummaryCard
                            key={highlight}
                            model={model}
                            highlight={highlight}
                            isWinner={highlight.includes("Lowest") || highlight.includes("Largest")}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Sections */}
          <div className="space-y-8">
            {/* Price Comparison */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  Price Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Input Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Input Pricing</h3>
                    <p className="text-sm text-gray-500 mb-4">per 1M tokens</p>
                    <div className="space-y-4">
                      {models.map((model, index) => (
                        <div key={`${model.id}-input`} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.pricing.inputMTok}
                              max={maxInputPrice}
                              height={12}
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-bold text-gray-900">
                            {formatPrice(model.pricing.inputMTok)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Output Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Output Pricing</h3>
                    <p className="text-sm text-gray-500 mb-4">per 1M tokens</p>
                    <div className="space-y-4">
                      {models.map((model, index) => (
                        <div key={`${model.id}-output`} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.pricing.outputMTok}
                              max={maxOutputPrice}
                              height={12}
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-bold text-gray-900">
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
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  Context Window
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Input Context */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Input Context</h3>
                    <div className="space-y-4">
                      {models.map((model, index) => (
                        <div key={`${model.id}-input-context`} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.features.contextWindow.input}
                              max={maxInputContext}
                              height={12}
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-bold text-gray-900">
                            {formatContextWindow(model.features.contextWindow.input)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Output Context */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Output Context</h3>
                    <div className="space-y-4">
                      {models.map((model, index) => (
                        <div key={`${model.id}-output-context`} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-gray-700">{model.name}</div>
                          <div className="flex-1">
                            <ModelHorizontalBar
                              modelId={model.id}
                              value={model.features.contextWindow.output}
                              max={maxOutputContext}
                              height={12}
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-bold text-gray-900">
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
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                        {models.map((model) => (
                          <th key={model.id} className="text-center py-3 px-4 font-semibold text-gray-900 min-w-[120px]">
                            {model.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr className="hover:bg-gray-25">
                        <td className="py-4 px-4 font-medium text-gray-700">Reasoning</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center">
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
                        <td className="py-4 px-4 font-medium text-gray-700">Function Calling</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center">
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
                        <td className="py-4 px-4 font-medium text-gray-700">Image Input</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center">
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
                        <td className="py-4 px-4 font-medium text-gray-700">Audio Input</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center">
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
                        <td className="py-4 px-4 font-medium text-gray-700">Audio Output</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center">
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
                        <td className="py-4 px-4 font-medium text-gray-700">Knowledge Cutoff</td>
                        {models.map((model) => (
                          <td key={model.id} className="py-4 px-4 text-center text-sm text-gray-600 font-medium">
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
