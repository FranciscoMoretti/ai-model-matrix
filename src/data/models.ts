
export interface ModelData {
  id: string;
  name: string;
  enabled: boolean;
  specification: {
    specificationVersion: string;
    provider: string;
    modelId: string;
    modelIdShort: string;
  };
  pricing: {
    inputMTok: number;
    outputMTok: number;
  };
  shortDescription: string;
  features: {
    reasoning: boolean;
    functionCalling: boolean;
    contextWindow: {
      input: number;
      output: number;
    };
    knowledgeCutoff: Date;
    input: {
      image: boolean;
      text: boolean;
      pdf: boolean;
      audio: boolean;
    };
    output: {
      image: boolean;
      text: boolean;
      audio: boolean;
    };
    fixedTemperature?: number;
  };
}

export const anthropicModels: ModelData[] = [
  {
    id: 'anthropic/claude-v3-opus',
    name: 'Claude 3 Opus',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'anthropic',
      modelId: 'anthropic/claude-3-opus-latest',
      modelIdShort: 'claude-3-opus-latest',
    },
    pricing: {
      inputMTok: 15,
      outputMTok: 75,
    },
    shortDescription: 'Powerful model for complex tasks',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 4096,
      },
      knowledgeCutoff: new Date('2023-08-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'anthropic/claude-v3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'anthropic',
      modelId: 'anthropic/claude-3-5-sonnet-latest',
      modelIdShort: 'claude-3-5-sonnet-latest',
    },
    pricing: {
      inputMTok: 3,
      outputMTok: 15,
    },
    shortDescription: 'Our previous intelligent model',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 8192,
      },
      knowledgeCutoff: new Date('2024-04-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'anthropic',
      modelId: 'anthropic/claude-3-5-haiku-latest',
      modelIdShort: 'claude-3-5-haiku-latest',
    },
    pricing: {
      inputMTok: 0.8,
      outputMTok: 4,
    },
    shortDescription: 'Our fastest model',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 8192,
      },
      knowledgeCutoff: new Date('2024-07-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'anthropic/claude-4-opus-20250514',
    name: 'Claude 4 Opus',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'anthropic',
      modelId: 'anthropic/claude-opus-4-0',
      modelIdShort: 'claude-opus-4-0',
    },
    pricing: {
      inputMTok: 15,
      outputMTok: 75,
    },
    shortDescription: 'Our most capable model',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 32000,
      },
      knowledgeCutoff: new Date('2025-03-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'anthropic/claude-4-sonnet-20250514',
    name: 'Claude 4 Sonnet',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'anthropic',
      modelId: 'anthropic/claude-sonnet-4-0',
      modelIdShort: 'claude-sonnet-4-0',
    },
    pricing: {
      inputMTok: 3,
      outputMTok: 15,
    },
    shortDescription: 'High-performance model',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 64000,
      },
      knowledgeCutoff: new Date('2025-03-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
];

export const googleModels: ModelData[] = [
  {
    id: 'google/gemini-2.5-flash-preview-05-20',
    name: 'Gemini 2.5 Flash Preview',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'google',
      modelId: 'google/gemini-2.5-flash-preview-05-20',
      modelIdShort: 'gemini-2.5-flash-preview-05-20',
    },
    pricing: {
      inputMTok: 0.15,
      outputMTok: 0.6,
    },
    shortDescription: 'Best price-performance model with adaptive thinking',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 1048576,
        output: 65536,
      },
      knowledgeCutoff: new Date('2025-01-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: true,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'google/gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash Lite',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'google',
      modelId: 'google/gemini-2.0-flash-lite',
      modelIdShort: 'gemini-2.0-flash-lite',
    },
    pricing: {
      inputMTok: 0.037,
      outputMTok: 0.15,
    },
    shortDescription: 'Cost-efficient version optimized for low latency',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 1048576,
        output: 8192,
      },
      knowledgeCutoff: new Date('2024-08-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: true,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
];

export const openaiModels: ModelData[] = [
  {
    id: 'openai/o3-mini',
    name: 'o3-mini',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'openai',
      modelId: 'openai/o3-mini',
      modelIdShort: 'o3-mini',
    },
    pricing: {
      inputMTok: 1.1,
      outputMTok: 4.4,
    },
    shortDescription: 'Small, cost-efficient reasoning model optimized for coding, math, and science',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 100000,
      },
      knowledgeCutoff: new Date('2023-10-01'),
      input: {
        image: false,
        text: true,
        pdf: false,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'openai/o3',
    name: 'o3',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'openai',
      modelId: 'openai/o3',
      modelIdShort: 'o3',
    },
    pricing: {
      inputMTok: 10.0,
      outputMTok: 40.0,
    },
    shortDescription: 'Advanced reasoning model for complex problem-solving tasks',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 100000,
      },
      knowledgeCutoff: new Date('2025-03-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    name: 'o4-mini',
    id: 'openai/o4-mini',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'openai',
      modelId: 'openai/o4-mini',
      modelIdShort: 'o4-mini',
    },
    pricing: {
      inputMTok: 1.1,
      outputMTok: 4.4,
    },
    shortDescription: 'Enhanced reasoning model with multimodal capabilities and improved performance',
    features: {
      reasoning: true,
      functionCalling: true,
      contextWindow: {
        input: 200000,
        output: 100000,
      },
      knowledgeCutoff: new Date('2024-05-31'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'openai/gpt-4.1',
    name: 'GPT-4.1',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'openai',
      modelId: 'openai/gpt-4.1',
      modelIdShort: 'gpt-4.1',
    },
    pricing: {
      inputMTok: 2.0,
      outputMTok: 8.0,
    },
    shortDescription: 'Latest flagship model with 1M token context and superior coding capabilities',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 1047576,
        output: 32768,
      },
      knowledgeCutoff: new Date('2024-06-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
  {
    id: 'openai/gpt-4.1-mini',
    name: 'GPT-4.1 mini',
    enabled: true,
    specification: {
      specificationVersion: 'v2',
      provider: 'openai',
      modelId: 'openai/gpt-4.1-mini',
      modelIdShort: 'gpt-4.1-mini',
    },
    pricing: {
      inputMTok: 0.4,
      outputMTok: 1.6,
    },
    shortDescription: 'Cost-efficient model with 1M context that matches GPT-4o performance',
    features: {
      reasoning: false,
      functionCalling: true,
      contextWindow: {
        input: 1047576,
        output: 32768,
      },
      knowledgeCutoff: new Date('2024-06-01'),
      input: {
        image: true,
        text: true,
        pdf: true,
        audio: false,
      },
      output: {
        image: false,
        text: true,
        audio: false,
      },
    },
  },
];

export const allModels = [...anthropicModels, ...googleModels, ...openaiModels];
export const enabledModels = allModels.filter(model => model.enabled);

export const getProviderColor = (provider: string) => {
  switch (provider) {
    case 'anthropic':
      return 'bg-orange-500';
    case 'google':
      return 'bg-blue-500';
    case 'openai':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const getProviderGradient = (provider: string) => {
  switch (provider) {
    case 'anthropic':
      return 'from-orange-500 to-red-500';
    case 'google':
      return 'from-blue-500 to-indigo-500';
    case 'openai':
      return 'from-green-500 to-emerald-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};
