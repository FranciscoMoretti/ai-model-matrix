
import React, { useState, useMemo } from 'react';
import { enabledModels, ModelData } from '@/data/models';
import ModelCard from '@/components/ModelCard';
import FilterBar from '@/components/FilterBar';
import ComparisonPanel from '@/components/ComparisonPanel';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [comparisonModels, setComparisonModels] = useState<ModelData[]>([]);

  const filteredModels = useMemo(() => {
    return enabledModels.filter((model) => {
      // Search filter
      if (searchTerm && !model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !model.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Provider filter
      if (selectedProvider !== 'all' && model.specification.provider !== selectedProvider) {
        return false;
      }

      // Price range filter
      if (priceRange !== 'all') {
        const inputPrice = model.pricing.inputMTok;
        switch (priceRange) {
          case 'budget':
            if (inputPrice > 1) return false;
            break;
          case 'mid':
            if (inputPrice <= 1 || inputPrice > 5) return false;
            break;
          case 'premium':
            if (inputPrice <= 5) return false;
            break;
        }
      }

      // Feature filters
      if (activeFilters.includes('reasoning') && !model.features.reasoning) return false;
      if (activeFilters.includes('image-input') && !model.features.input.image) return false;
      if (activeFilters.includes('audio-input') && !model.features.input.audio) return false;
      if (activeFilters.includes('audio-output') && !model.features.output.audio) return false;
      if (activeFilters.includes('function-calling') && !model.features.functionCalling) return false;
      if (activeFilters.includes('budget-friendly') && model.pricing.inputMTok > 1) return false;

      return true;
    });
  }, [searchTerm, selectedProvider, priceRange, activeFilters]);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvider('all');
    setPriceRange('all');
    setActiveFilters([]);
  };

  const handleAddToComparison = (model: ModelData) => {
    if (comparisonModels.length < 3 && !comparisonModels.find(m => m.id === model.id)) {
      setComparisonModels(prev => [...prev, model]);
    }
  };

  const handleRemoveFromComparison = (modelId: string) => {
    setComparisonModels(prev => prev.filter(m => m.id !== modelId));
  };

  const handleClearComparison = () => {
    setComparisonModels([]);
  };

  const topProviders = [
    { name: 'OpenAI', count: enabledModels.filter(m => m.specification.provider === 'openai').length, color: 'bg-green-500' },
    { name: 'Anthropic', count: enabledModels.filter(m => m.specification.provider === 'anthropic').length, color: 'bg-orange-500' },
    { name: 'Google', count: enabledModels.filter(m => m.specification.provider === 'google').length, color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Model Comparison
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare AI models from leading providers. Find the perfect model for your needs based on features, pricing, and capabilities.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {topProviders.map((provider) => (
                <Badge key={provider.name} variant="outline" className="px-4 py-2">
                  <div className={`w-3 h-3 rounded-full ${provider.color} mr-2`}></div>
                  {provider.name} ({provider.count})
                </Badge>
              ))}
              <Badge variant="outline" className="px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                {enabledModels.length} Models Available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredModels.length} Model{filteredModels.length !== 1 ? 's' : ''} Found
          </h2>
          {filteredModels.length > 0 && (
            <div className="text-sm text-gray-500">
              Click the + button to compare models
            </div>
          )}
        </div>

        {/* Model Grid */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onCompare={handleAddToComparison}
                isComparing={comparisonModels.length >= 3 || comparisonModels.some(m => m.id === model.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Zap className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel
        models={comparisonModels}
        onRemoveModel={handleRemoveFromComparison}
        onClearAll={handleClearComparison}
      />
    </div>
  );
};

export default Index;
