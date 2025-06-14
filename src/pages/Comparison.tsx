
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { enabledModels, ModelData } from '@/data/models';
import { ArrowLeft, DollarSign, FileText, Star } from 'lucide-react';
import { ModelColorProvider } from "@/components/ModelColorContext";
import { ModelHorizontalBar } from "@/components/ModelHorizontalBar";
import { ModelSummaryCard } from "@/components/ModelSummaryCard";

// Formatters
const formatContextWindow = (tokens: number) => {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(0)}K`;
  return tokens.toString();
};
const formatPrice = (price: number) => price < 1 ? `$${price.toFixed(3)}` : `$${price.toFixed(2)}`;

// Highlight generator
const getHighlights = (models: ModelData[], model: ModelData) => {
  const minInputPrice = Math.min(...models.map((m) => m.pricing.inputMTok));
  const minOutputPrice = Math.min(...models.map((m) => m.pricing.outputMTok));
  const maxContextWindow = Math.max(...models.map((m) => m.features.contextWindow.input));
  const highlights: { text: string, winner: boolean }[] = [];
  if (model.pricing.inputMTok === minInputPrice) highlights.push({ text: "Lowest input price", winner: true });
  if (model.pricing.outputMTok === minOutputPrice) highlights.push({ text: "Lowest output price", winner: true });
  if (model.features.contextWindow.input === maxContextWindow) highlights.push({ text: "Largest context window", winner: true });
  return highlights;
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

  // Calculate max values for bars
  const maxInputPrice = Math.max(...models.map(m => m.pricing.inputMTok));
  const maxOutputPrice = Math.max(...models.map(m => m.pricing.outputMTok));
  const maxInputContext = Math.max(...models.map(m => m.features.contextWindow.input));
  const maxOutputContext = Math.max(...models.map(m => m.features.contextWindow.output));

  // ==== RENDER ====
  return (
    <ModelColorProvider models={models}>
      <div className="min-h-screen bg-[#f7faff] pb-8">
        {/* Header */}
        <div className="bg-transparent py-8">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-center gap-6 mb-2">
              <Link to="/" className="shrink-0">
                <Button variant="ghost" size="sm" className="text-gray-700 font-semibold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Models
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Model Comparison</h1>
                <span className="text-gray-600 text-base">{models.length} models selected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model Summary Cards */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-4 mb-10">
          {models.map((model) => {
            const highlights = getHighlights(models, model);
            return (
              <div
                key={model.id}
                className="rounded-2xl bg-white shadow-md border border-gray-200 flex-1 min-w-[240px] px-8 py-6 flex flex-col"
                style={{ minHeight: 152 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl md:text-2xl font-bold text-gray-900">{model.name}</span>
                </div>
                <div className="mb-3 text-gray-600 text-base">{model.shortDescription}</div>
                {highlights.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {highlights.map((h, i) => (
                      <div className="flex items-center gap-2" key={h.text + i}>
                        {h.winner && (
                          <span className="inline-flex items-center bg-yellow-400 text-white text-xs 
                                           px-2 py-0.5 rounded-full font-semibold mr-1">
                            <Star className="w-4 h-4 mr-1 text-white inline" strokeWidth={2.5} fill="currentColor" />
                            Winner
                          </span>
                        )}
                        <ModelSummaryCard model={model} highlight={h.text} isWinner={false} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Price Comparison */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
          <Card className="rounded-2xl shadow border-0 bg-white">
            <CardContent className="px-10 py-8">
              <h2 className="font-semibold text-lg text-gray-900 flex items-center mb-6">
                <DollarSign className="w-5 h-5 mr-2" />
                Price Comparison
              </h2>

              {/* Input Pricing */}
              <div className="mb-6">
                <div className="font-medium mb-2 text-gray-900">
                  Input Pricing <span className="text-xs text-gray-500 font-normal">(per 1M tokens)</span>
                </div>
                <div className="space-y-3">
                  {models.map((model) => (
                    <div key={`${model.id}-input`} className="flex items-center gap-2">
                      <div className="text-gray-900 min-w-[160px] text-base font-medium">{model.name}</div>
                      <div className="flex-1 mx-2">
                        <ModelHorizontalBar
                          modelId={model.id}
                          value={model.pricing.inputMTok}
                          max={maxInputPrice}
                          height={14}
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
                      <div className="text-gray-900 min-w-[160px] text-base font-medium">{model.name}</div>
                      <div className="flex-1 mx-2">
                        <ModelHorizontalBar
                          modelId={model.id}
                          value={model.pricing.outputMTok}
                          max={maxOutputPrice}
                          height={14}
                        />
                      </div>
                      <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
                        {formatPrice(model.pricing.outputMTok)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Context Window */}
          <Card className="rounded-2xl shadow border-0 bg-white">
            <CardContent className="px-10 py-8">
              <h2 className="font-semibold text-lg text-gray-900 flex items-center mb-6">
                <FileText className="w-5 h-5 mr-2" />
                Context Window
              </h2>
              {/* Input Context */}
              <div className="mb-6">
                <div className="font-medium mb-2 text-gray-900">
                  Input Context
                </div>
                <div className="space-y-3">
                  {models.map((model) => (
                    <div key={`${model.id}-input-context`} className="flex items-center gap-2">
                      <div className="text-gray-900 min-w-[160px] text-base font-medium">{model.name}</div>
                      <div className="flex-1 mx-2">
                        <ModelHorizontalBar
                          modelId={model.id}
                          value={model.features.contextWindow.input}
                          max={maxInputContext}
                          height={14}
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
                      <div className="text-gray-900 min-w-[160px] text-base font-medium">{model.name}</div>
                      <div className="flex-1 mx-2">
                        <ModelHorizontalBar
                          modelId={model.id}
                          value={model.features.contextWindow.output}
                          max={maxOutputContext}
                          height={14}
                        />
                      </div>
                      <div className="text-base min-w-[4.5rem] font-semibold text-right tabular-nums text-gray-900">
                        {formatContextWindow(model.features.contextWindow.output)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModelColorProvider>
  );
};

export default Comparison;

