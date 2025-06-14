
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Brain, Zap, DollarSign, FileText, Image, Mic, Volume2 } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedProvider: string;
  onProviderChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedProvider,
  onProviderChange,
  priceRange,
  onPriceRangeChange,
  activeFilters,
  onFilterToggle,
  onClearFilters,
}) => {
  const filterOptions = [
    { id: 'reasoning', label: 'Reasoning', icon: Brain },
    { id: 'image-input', label: 'Image Input', icon: Image },
    { id: 'audio-input', label: 'Audio Input', icon: Mic },
    { id: 'audio-output', label: 'Audio Output', icon: Volume2 },
    { id: 'function-calling', label: 'Function Calling', icon: Zap },
    { id: 'budget-friendly', label: 'Budget Friendly', icon: DollarSign },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Provider Filter */}
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All Providers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="google">Google</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range Filter */}
        <Select value={priceRange} onValueChange={onPriceRangeChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All Prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="budget">Budget ($0-1/M tokens)</SelectItem>
            <SelectItem value="mid">Mid-range ($1-5/M tokens)</SelectItem>
            <SelectItem value="premium">Premium ($5+/M tokens)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feature Filters */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Capabilities</div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(({ id, label, icon: Icon }) => (
            <Badge
              key={id}
              variant={activeFilters.includes(id) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => onFilterToggle(id)}
            >
              <Icon className="w-3 h-3 mr-1" />
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(activeFilters.length > 0 || searchTerm || selectedProvider !== 'all' || priceRange !== 'all') && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm text-gray-500">Active filters:</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
