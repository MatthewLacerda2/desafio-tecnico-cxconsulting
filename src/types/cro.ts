export interface CROAnalysis {
  pageSummary: string
  recommendedImprovements: string[]
  improvementsSummary: string
}

// For the Gemini API schema
export const geminiCROSchema = {
  type: 'object' as const,
  properties: {
    pageSummary: {
      type: 'string' as const,
      description: "Main themes that the AI focused on, comma-separated"
    },
    recommendedImprovements: {
      type: 'array' as const,
      items: { type: 'string' as const },
      description: "Array of improvement recommendations"
    },
    improvementsSummary: {
      type: 'string' as const,
      description: "Summary of all recommended improvements"
    }
  }
}
