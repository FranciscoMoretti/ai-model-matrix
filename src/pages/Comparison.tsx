
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

  // Formatting helpers
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

  // Extra: Provider accent color utility
  const getAccentBorder = (provider: string) => {
    switch (provider) {
      case 'google': return 'border-blue-500';
      case 'anthropic': return 'border-orange-500';
      case 'openai': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-0">
      {/* Header */}
      <div className="bg-white/90 border-b border-gray-200/80 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
          <Link to="/" className="shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Models
            </Button>
          </Link>
          <div className="flex flex-col gap-0 flex-1 ml-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-0">Model Comparison</h1>
            <span className="text-gray-600 text-base">{models.length} models selected</span>
          </div>
        </div>
      </div>

      {/* Top Model Cards */}
      <div className="bg-[#f7fafd] py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-5">
          {models.map((model) => (
            <div
              key={model.id}
              className={`flex-1 rounded-xl bg-white border-2 shadow-sm p-5 flex flex-col items-center min-w-[220px] ${getAccentBorder(model.specification.provider)}`}
            >
              <div className="flex gap-2 mb-2 items-center">
                <Badge
                  variant="secondary"
                  className={`text-white text-xs font-semibold ${getProviderColor(model.specification.provider)}`}
                >
                  {model.specification.provider.toUpperCase()}
                </Badge>
                {model.features.reasoning && (
                  <Badge variant="outline" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                  </Badge>
                )}
              </div>
              <div className="text-lg md:text-xl font-bold text-center text-gray-900">{model.name}</div>
              <div className="text-sm text-gray-600 text-center">{model.shortDescription}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 pb-12">
        {/* Price Comparison */}
        <Card className="rounded-xl shadow border-0">
          <CardHeader className="bg-white rounded-t-xl border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <DollarSign className="w-5 h-5" />
              Price Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 bg-white rounded-b-xl">
            <div className="space-y-6">
              <div>
                <div className="font-medium mb-2 text-gray-900">Input Pricing <span className="text-xs text-gray-500">(per 1M tokens)</span></div>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div key={`${model.id}-input`} className="flex items-center">
                      <span className="font-medium text-gray-700 min-w-[140px]">{model.name}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-5 flex items-center">
                          <div className="w-full bg-gray-100 rounded-full h-3 absolute" />
                          <div
                            className={`h-3 rounded-full absolute ${getProviderColor(model.specification.provider)}`}
                            style={{
                              width: `${(model.pricing.inputMTok / maxInputPrice) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-base font-semibold min-w-[4rem] text-right text-gray-800">
                        {formatPrice(model.pricing.inputMTok)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-900">Output Pricing <span className="text-xs text-gray-500">(per 1M tokens)</span></div>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div key={`${model.id}-output`} className="flex items-center">
                      <span className="font-medium text-gray-700 min-w-[140px]">{model.name}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-5 flex items-center">
                          <div className="w-full bg-gray-100 rounded-full h-3 absolute" />
                          <div
                            className={`h-3 rounded-full absolute ${getProviderColor(model.specification.provider)}`}
                            style={{
                              width: `${(model.pricing.outputMTok / maxOutputPrice) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-base font-semibold min-w-[4rem] text-right text-gray-800">
                        {formatPrice(model.pricing.outputMTok)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context Window Comparison */}
        <Card className="rounded-xl shadow border-0">
          <CardHeader className="bg-white rounded-t-xl border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="w-5 h-5" />
              Context Window
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 bg-white rounded-b-xl">
            <div className="space-y-6">
              <div>
                <div className="font-medium mb-2 text-gray-900">Input Context</div>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div key={`${model.id}-input-context`} className="flex items-center">
                      <span className="font-medium text-gray-700 min-w-[140px]">{model.name}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-5 flex items-center">
                          <div className="w-full bg-gray-100 rounded-full h-3 absolute" />
                          <div
                            className={`h-3 rounded-full absolute ${getProviderColor(model.specification.provider)}`}
                            style={{
                              width: `${(model.features.contextWindow.input / maxInputContext) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-base font-semibold min-w-[4rem] text-right text-gray-800">
                        {formatContextWindow(model.features.contextWindow.input)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2 text-gray-900">Output Context</div>
                <div className="space-y-2">
                  {models.map((model) => (
                    <div key={`${model.id}-output-context`} className="flex items-center">
                      <span className="font-medium text-gray-700 min-w-[140px]">{model.name}</span>
                      <div className="flex-1 mx-4">
                        <div className="relative h-5 flex items-center">
                          <div className="w-full bg-gray-100 rounded-full h-3 absolute" />
                          <div
                            className={`h-3 rounded-full absolute ${getProviderColor(model.specification.provider)}`}
                            style={{
                              width: `${(model.features.contextWindow.output / maxOutputContext) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-base font-semibold min-w-[4rem] text-right text-gray-800">
                        {formatContextWindow(model.features.contextWindow.output)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Table */}
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
  );
};

export default Comparison;
