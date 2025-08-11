export interface CROAnalysis {
  pageSummaryList: string
  currentMetrics: {
    estimatedConversionRate: string
    bounceRate: string
    averageTimeOnPage: string
    cartAbandonRate: string
  }
  improvements: Improvement[]
  expectedResults: {
    expectedConversionRate: string
    expectedBounceRate: string
    expectedTimeOnPage: string
    expectedCartAbandonRate: string
  }
  recommendationsSummary: string
}

export interface Improvement {
  recommended_improvements: string
  summary: string
  priority: 'low' | 'medium' | 'high'
  expected_impact: 'low' | 'medium' | 'high'
}

// For the Gemini API schema
export const geminiCROSchema = {
  type: 'object' as const,
  properties: {
    pageSummaryList: {
      type: 'string' as const,
      description: "Main themes that the AI focused on, comma-separated"
    },
    currentMetrics: {
      type: 'object' as const,
      properties: {
        estimatedConversionRate: { type: 'string' as const },
        bounceRate: { type: 'string' as const },
        averageTimeOnPage: { type: 'string' as const },
        cartAbandonRate: { type: 'string' as const }
      }
    },
    improvements: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          recommended_improvements: { type: 'string' as const },
          summary: { type: 'string' as const },
          priority: { 
            type: 'string' as const,
            enum: ["low", "medium", "high"]
          },
          expected_impact: { 
            type: 'string' as const,
            enum: ["low", "medium", "high"]
          }
        }
      }
    },
    expectedResults: {
      type: 'object' as const,
      properties: {
        expectedConversionRate: { type: 'string' as const },
        expectedBounceRate: { type: 'string' as const },
        expectedTimeOnPage: { type: 'string' as const },
        expectedCartAbandonRate: { type: 'string' as const }
      }
    },
    recommendationsSummary: {
      type: 'string' as const,
      description: "Overall summary of what the changes will accomplish"
    }
  }
}
