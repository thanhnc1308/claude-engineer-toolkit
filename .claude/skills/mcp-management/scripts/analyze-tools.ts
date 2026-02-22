#!/usr/bin/env node
/**
 * Tool Analyzer - Intelligently selects relevant MCP tools for tasks
 */

interface ToolInfo {
  serverName: string;
  name: string;
  description: string;
  inputSchema?: {
    properties?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface ScoredTool {
  tool: ToolInfo;
  score: number;
  reasons: string[];
}

interface AnalysisResult {
  relevantTools: ToolInfo[];
  reasoning: string[];
  confidence: number;
}

/**
 * Analyze tools and return those relevant to the task
 */
export function analyzeToolsForTask(tools: ToolInfo[], taskDescription: string): AnalysisResult {
  const keywords = extractKeywords(taskDescription);

  const scoredTools: ScoredTool[] = tools.map((tool) => ({
    tool,
    score: calculateRelevanceScore(tool, keywords, taskDescription),
    reasons: explainScore(tool, keywords, taskDescription),
  }));

  // Sort by score descending
  scoredTools.sort((a, b) => b.score - a.score);

  // Filter tools with score above threshold
  const threshold = 0.3;
  const relevant = scoredTools.filter((st) => st.score > threshold);

  return {
    relevantTools: relevant.map((st) => st.tool),
    reasoning: relevant.map(
      (st) => `${st.tool.name} (${st.tool.serverName}): ${st.reasons.join('; ')}`,
    ),
    confidence: relevant.length > 0 ? relevant[0].score : 0,
  };
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'as',
    'is',
    'was',
    'are',
  ]);

  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

function calculateRelevanceScore(
  tool: ToolInfo,
  keywords: string[],
  taskDescription: string,
): number {
  let score = 0;
  const toolText = `${tool.name} ${tool.description}`.toLowerCase();

  // Keyword matching
  for (const keyword of keywords) {
    if (toolText.includes(keyword)) {
      score += 0.2;
    }
  }

  // Exact phrase matching
  const taskLower = taskDescription.toLowerCase();
  if (toolText.includes(taskLower) || taskLower.includes(tool.name.toLowerCase())) {
    score += 0.5;
  }

  // Schema complexity bonus (more params = more specialized)
  if (tool.inputSchema?.properties) {
    const paramCount = Object.keys(tool.inputSchema.properties).length;
    score += Math.min(paramCount * 0.05, 0.3);
  }

  return Math.min(score, 1.0);
}

function explainScore(tool: ToolInfo, keywords: string[], _taskDescription: string): string[] {
  const reasons: string[] = [];
  const toolText = `${tool.name} ${tool.description}`.toLowerCase();

  const matchedKeywords = keywords.filter((k) => toolText.includes(k));
  if (matchedKeywords.length > 0) {
    reasons.push(`matches keywords: ${matchedKeywords.join(', ')}`);
  }

  if (tool.description) {
    reasons.push(`description: ${tool.description.slice(0, 100)}`);
  }

  return reasons;
}
