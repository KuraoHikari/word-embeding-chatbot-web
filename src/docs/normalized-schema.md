# Normalized Schema

Target internal schema setelah parsing:

NormalizedExperiment:

- modelType: "baseline" | "hybrid"
- records: NormalizedRecord[]

NormalizedRecord:

- id: string
- query: string
- processingTime: number
- tokens:
  - prompt: number
  - completion: number
  - total: number
- retrieval:
  - retrievedCount: number
  - rerankedCount?: number
  - scoreList: number[]
- ragas?:
  - contextRelevance: number
  - faithfulness: number
  - answerRelevance: number
  - overallScore: number
