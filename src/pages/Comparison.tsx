import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { enabledModels, ModelData, getProviderColor } from '@/data/models';
import { ArrowLeft, Brain, Zap, FileText, Image, Mic, Volume2, DollarSign } from 'lucide-react';
import { ModelColorProvider } from "@/components/ModelColorContext";
import { ModelHorizontalBar } from "@/components/ModelHorizontalBar";
import { ModelSummaryCard } from "@/components/ModelSummaryCard";

// HorizontalStatBar is a local helper for the comparison bars
function HorizontalStatBar({
  value,
  max,
  colorClass,
  height = 14,
}: {
  value: number;
  max: number;
  colorClass: string;
  height?: number;
}) {
  const percentage = max === 0 ? 0 : (value / max) * 100;
  return (
    <div className="relative w-full flex items-center" style={{ height }}>
      <div
        className="absolute rounded-full w-full bg-gray-200"
        style={{ height }}
      />
      <div
        className={`absolute rounded-full ${colorClass}`}
        style={{ width: `${percentage}%`, height }}
      />
    </div>
  );
}

const providerCardBorder = {
  google: 'border-blue-500',
  anthropic: 'border-orange-500',
  openai: 'border-green-500',
};

const providerCardText = {
  google: 'text-blue-600',
  anthropic: 'text-orange-600',
  openai: 'text-green-600',
};

const providerCardBadge = {
  google: 'bg-blue-500',
  anthropic: 'bg-orange-500',
  openai: 'bg-green-500',
};

const providerLabel = {
  google: 'GOOGLE',
  anthropic: 'ANTHROPIC',
  openai: 'OPENAI',
};

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
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

  // Get color by provider
  const getProviderColorClass = (provider: string) => {
    if (provider === 'google') return 'bg-blue-500';
    if (provider === 'anthropic') return 'bg-orange-500';
    if (provider === 'openai') return 'bg-green-500';
    return 'bg-gray-400';
  };

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

  // ==== RENDER ====
  return (
    <ModelColorProvider models={models}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/95 border-b border-gray-200/80 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex items-center gap-6">
            <Link to="/" className="shrink-0">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Models
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Model Comparison</h1>
              <span className="text-gray-600 text-base">{models.length} models selected</span>
            </div>
          </div>
        </div>

        {/* Top Model Cards with summaries */}
        <div className="bg-transparent pt-10 pb-2">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-5">
            {models.map((model) => (
              <div
                key={model.id}
                className={`flex-1 border-2 rounded-2xl px-6 pb-4 pt-4 bg-white flex flex-col items-start min-w-[220px] shadow-sm`}
              >
                <div className={`text-xl font-bold my-1`}>{model.name}</div>
                <div className="text-gray-600 text-base font-normal">{model.shortDescription}</div>
                {getHighlights(model).map((highlight, idx) => (
                  <ModelSummaryCard
                    key={highlight}
                    model={model}
                    highlight={highlight}
                    isWinner={highlight.includes("Lowest") || highlight.includes("Largest")}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Sections */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-7 pb-12">

          {/* Price Comparison */}
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="px-8 py-7">
              <h2 className="font-semibold text-lg text-gray-900 flex items-center mb-5">
                <DollarSign className="w-5 h-5 mr-2" />
                Price Comparison
              </h2>
              <div className="space-y-8 md:space-y-6">
                {/* Input Pricing */}
                <div>
                  <div className="font-medium mb-2 text-gray-900">
                    Input Pricing <span className="text-xs text-gray-500 font-normal">(per 1M tokens)</span>
                  </div>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-input`} className="flex items-center gap-2">
                        <div className="text-gray-700 min-w-[160px] text-base font-medium">{model.name}</div>
                        <div className="flex-1 mx-2">
                          <ModelHorizontalBar
                            modelId={model.id}
                            value={model.pricing.inputMTok}
                            max={maxInputPrice}
                          />
                        </div>
                        <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
                          {formatPrice(model.pricing.inputMTok)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Pricing */}
                <div>
                  <div className="font-medium mb-2 text-gray-900">
                    Output Pricing <span className="text-xs text-gray-500 font-normal">(per 1M tokens)</span>
                  </div>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-output`} className="flex items-center gap-2">
                        <div className="text-gray-700 min-w-[160px] text-base font-medium">{model.name}</div>
                        <div className="flex-1 mx-2">
                          <ModelHorizontalBar
                            modelId={model.id}
                            value={model.pricing.outputMTok}
                            max={maxOutputPrice}
                          />
                        </div>
                        <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
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
          <Card className="rounded-2xl shadow-sm border-0 bg-white">
            <CardContent className="px-8 py-7">
              <h2 className="font-semibold text-lg text-gray-900 flex items-center mb-5">
                <FileText className="w-5 h-5 mr-2" />
                Context Window
              </h2>
              <div className="space-y-8 md:space-y-6">
                {/* Input Context */}
                <div>
                  <div className="font-medium mb-2 text-gray-900">
                    Input Context
                  </div>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-input-context`} className="flex items-center gap-2">
                        <div className="text-gray-700 min-w-[160px] text-base font-medium">{model.name}</div>
                        <div className="flex-1 mx-2">
                          <ModelHorizontalBar
                            modelId={model.id}
                            value={model.features.contextWindow.input}
                            max={maxInputContext}
                          />
                        </div>
                        <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
                          {formatContextWindow(model.features.contextWindow.input)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Output Context */}
                <div>
                  <div className="font-medium mb-2 text-gray-900">
                    Output Context
                  </div>
                  <div className="space-y-3">
                    {models.map((model) => (
                      <div key={`${model.id}-output-context`} className="flex items-center gap-2">
                        <div className="text-gray-700 min-w-[160px] text-base font-medium">{model.name}</div>
                        <div className="flex-1 mx-2">
                          <ModelHorizontalBar
                            modelId={model.id}
                            value={model.features.contextWindow.output}
                            max={maxOutputContext}
                          />
                        </div>
                        <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
                          {formatContextWindow(model.features.contextWindow.output)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow border-0">
            <CardHeader className="bg-white rounded-t-xl border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Zap className="w-5 h-5" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 bg-white rounded-b-xl overflow-x-auto">
              <table className="w-full table-fixed border-spacing-y-3">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-base">Feature</th>
                    {models.map((model) => (
                      <th key={model.id} className="text-center py-3 px-4 font-semibold text-gray-700 text-base min-w-[120px]">
                        {model.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Reasoning</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center">
                        {model.features.reasoning ? (
                          <Brain className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-xl">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Function Calling</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center">
                        {model.features.functionCalling ? (
                          <Zap className="w-6 h-6 text-blue-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-xl">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Image Input</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center">
                        {model.features.input.image ? (
                          <Image className="w-6 h-6 text-purple-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-xl">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Audio Input</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center">
                        {model.features.input.audio ? (
                          <Mic className="w-6 h-6 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-xl">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Audio Output</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center">
                        {model.features.output.audio ? (
                          <Volume2 className="w-6 h-6 text-orange-500 mx-auto" />
                        ) : (
                          <span className="text-gray-400 text-xl">−</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-gray-700">Knowledge Cutoff</td>
                    {models.map((model) => (
                      <td key={model.id} className="py-3 px-4 text-center text-sm text-gray-600 font-semibold">
                        {model.features.knowledgeCutoff.toLocaleDateString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModelColorProvider>
  );
};

export default Comparison;
