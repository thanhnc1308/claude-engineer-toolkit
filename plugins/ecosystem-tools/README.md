# ecosystem-tools

Tools for creating and managing skills, commands, and plugins in the Claude Code ecosystem. This plugin provides a test-driven approach to documentation, helping you create high-quality, discoverable skills that other Claude instances can effectively use.

## Installation

```bash
/plugin install ecosystem-tools@claude-engineer-toolkit
```

## Overview

The ecosystem-tools plugin applies Test-Driven Development (TDD) principles to skill creation. Just as you write tests before code, you run baseline scenarios before writing skills, ensuring your documentation addresses real agent behavior and challenges.

## Features

- **Test-Driven Documentation**: Write failing tests (baseline scenarios) before creating skills
- **RED-GREEN-REFACTOR Cycle**: Systematic approach to skill creation and refinement
- **Claude Search Optimization (CSO)**: Guidelines for making skills discoverable
- **Bulletproofing Against Rationalization**: Techniques to create discipline-enforcing skills
- **Token Efficiency**: Best practices for keeping skills concise and context-efficient

## Commands

- `/create-skill [skill name or topic]`: Create or edit a skill using test-driven documentation principles. Guides you through the RED-GREEN-REFACTOR cycle with baseline scenarios, minimal skill writing, and loophole closing.

## Skills

- **creating-skills**: Use when creating new skills, editing existing skills, or verifying skills work before deployment. Provides comprehensive guidance on skill structure, CSO optimization, testing methodologies, and the TDD approach to documentation.

## Usage

### Creating a New Skill

```bash
/create-skill condition-based-waiting
```

This will guide you through:

1. **RED Phase**: Running baseline scenarios WITHOUT the skill to observe natural agent behavior
2. **GREEN Phase**: Writing minimal skill documentation to address observed failures
3. **REFACTOR Phase**: Closing loopholes by testing edge cases and adding explicit counters

### Key Principles

**The Iron Law**: No skill without a failing test first. This applies to new skills AND edits to existing skills.

**TDD Mapping for Skills**:

- Test case → Pressure scenario with subagent
- Production code → Skill document (SKILL.md)
- Test fails (RED) → Agent violates rule without skill
- Test passes (GREEN) → Agent complies with skill present
- Refactor → Close loopholes while maintaining compliance

### Skill Types

1. **Discipline-Enforcing Skills**: Rules and requirements (test with pressure scenarios)
2. **Technique Skills**: How-to guides (test with application scenarios)
3. **Pattern Skills**: Mental models (test with recognition scenarios)
4. **Reference Skills**: Documentation/APIs (test with retrieval scenarios)

## Best Practices

- **Claude Search Optimization (CSO)**: Make descriptions focus on "when to use" not "what it does"
- **Token Efficiency**: Keep frequently-loaded skills under 200 words
- **Cross-References**: Use skill names with requirement markers, avoid `@` syntax
- **Flowcharts**: Only for non-obvious decision points, never for reference material
- **Examples**: One excellent example beats many mediocre ones

## Related Skills

- **test-driven-development**: Core TDD principles that this plugin adapts for documentation
- **systematic-debugging**: Debugging techniques useful for identifying skill gaps

## Contributing

Skills created with this plugin can be contributed back to the community. Follow the TDD process, ensure thorough testing, and create a PR to share your work.
