---
name: researching
description: Multi-source technology research across docs, GitHub, articles, and videos. Evaluate frameworks, conduct pre-implementation research, or compare technical approaches.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash, WebFetch, WebSearch
argument-hint: [technology, framework, or research question]
---

# Research Session

Structured workflow for gathering, validating, and synthesizing technology intelligence from multiple sources into actionable implementation insights.

## Process

### 1. Scope Definition

- Restate the research question to confirm understanding
- Identify key evaluation criteria (maturity, performance, security, DX, community)
- Determine depth needed: quick survey vs. deep dive vs. comparison
- Clarify desired output: recommendation, comparison matrix, implementation guide, or risk assessment

### 2. Parallel Source Exploration

- Search official documentation and migration guides first
- Explore GitHub repositories for real-world implementation patterns, stars, issue resolution time, and release frequency
- Review recent articles and blog posts for community insights and adoption trends
- Check for video tutorials and conference talks for architecture walkthroughs
- Scan security advisories and vulnerability databases for known risks
- Aim for 10+ sources per research topic to ensure comprehensive coverage

### 3. Validation & Cross-Referencing

- Cross-check implementation patterns across multiple independent sources
- Verify version compatibility and currency of information — flag outdated content
- Confirm security recommendations against official advisories (CVE databases, GitHub Security)
- Validate performance claims with benchmarks, profiling data, or reproducible evidence
- Note conflicting information explicitly with source attribution

### 4. Synthesis & Reporting

- Consolidate findings into the structured report format below
- Highlight actionable insights and clear recommendations with supporting rationale
- Include code examples with proper error handling where applicable
- List all sources with relevance notes for traceability
- Document gaps where information is limited or conflicting

## Output Format

```markdown
# Research Report: [Topic]

## Executive Summary

[2-3 sentence overview of key findings and recommendation]

## Key Findings

### Integration Approaches

- **Approach A**: [Description, pros, cons]
- **Approach B**: [Description, pros, cons]

### Security Considerations

- [Finding 1 with source reference]
- [Finding 2 with source reference]

### Performance Characteristics

- [Benchmark or metric 1]
- [Benchmark or metric 2]

## Implementation Guide

[Step-by-step guide with code examples]

## Risks & Mitigations

- **Risk**: [Description]
  - Mitigation: [How to address]

## Sources

1. [Source title](URL) - [Brief note on relevance]
2. [Source title](URL) - [Brief note on relevance]

## Recommended Next Steps

- [ ] Action item 1
- [ ] Action item 2
```

## Key Principles

- **Official sources first** — start with official documentation before community content
- **Verify currency** — check publication dates and version compatibility; prefer recent sources
- **Evidence-based** — back every recommendation with specific sources and data
- **Stay objective** — present trade-offs honestly; never advocate without acknowledging downsides
- **Think practically** — focus on production-readiness, not theoretical elegance
- **Cross-validate** — never rely on a single source for critical implementation decisions
- **Document gaps** — explicitly note areas where information is limited or conflicting

## After Research

**Documentation:**

- Write the validated report to `docs/research/YYYY-MM-DD-<topic>.md`
- Commit the research document to git

**Implementation (if continuing):**

- Ask: "Ready to move to implementation planning?"
- Use dev-workflow:planning skill to create a detailed implementation plan
- Use dev-workflow:brainstorming skill if trade-off evaluation is still needed
