# Metrics Definition

Summary metrics required:

- avgLatency
- p95Latency
- avgOverallScore
- failureRate:
  define as: - missing ragas OR - overallScore < threshold OR - empty answer

- winRegression:
  delta = B.overallScore - A.overallScore
