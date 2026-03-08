---
name: mcp-management
description: Manage Model Context Protocol (MCP) servers - discover, analyze, and execute tools/prompts/resources from configured MCP servers. Use when working with MCP integrations, need to discover available MCP capabilities, filter MCP tools for specific tasks, execute MCP tools programmatically, access MCP prompts/resources, or implement MCP client functionality. Supports intelligent tool selection, multi-server management, and context-efficient capability discovery.
---

# MCP Management

Skill for managing and interacting with Model Context Protocol (MCP) servers.

## Overview

MCP is an open protocol enabling AI agents to connect to external tools and data sources. This skill provides scripts and utilities to discover, analyze, and execute MCP capabilities from configured servers without polluting the main context window.

**Key Benefits**:

- Progressive disclosure of MCP capabilities (load only what's needed)
- Intelligent tool/prompt/resource selection based on task requirements
- Multi-server management from single config file
- Context-efficient: subagents handle MCP discovery and execution
- Persistent tool catalog: automatically saves discovered tools to JSON for fast reference

## When to Use This Skill

Use this skill when:

1. **Discovering MCP Capabilities**: Need to list available tools/prompts/resources from configured servers
2. **Task-Based Tool Selection**: Analyzing which MCP tools are relevant for a specific task
3. **Executing MCP Tools**: Calling MCP tools programmatically with proper parameter handling
4. **MCP Integration**: Building or debugging MCP client implementations
5. **Context Management**: Avoiding context pollution by delegating MCP operations to subagents

## Core Capabilities

### 1. Configuration Management

MCP servers configured in `.claude/.mcp.json`.

**Gemini CLI Integration** (recommended): Create symlink to `.gemini/settings.json`:

```bash
[ ! -f .gemini/settings.json ] && mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
```

See [references/configuration.md](references/configuration.md) and [references/gemini-cli-integration.md](references/gemini-cli-integration.md).

### 2. Capability Discovery

```bash
npx tsx scripts/cli.ts list-tools  # Saves to assets/tools.json
npx tsx scripts/cli.ts list-prompts
npx tsx scripts/cli.ts list-resources
```

Aggregates capabilities from multiple servers with server identification.

### 3. Intelligent Tool Analysis

LLM analyzes `assets/tools.json` directly -- better than keyword matching algorithms. Uses context understanding, synonyms, and intent recognition to select relevant tools across multiple servers.

### 4. Tool Execution

See [Execution Priority](#execution-priority) for the canonical method order and commands.

## Scripts Reference

### scripts/mcp-client.ts

Core MCP client manager class. Handles:

- Config loading from `.claude/.mcp.json`
- Connecting to multiple MCP servers
- Listing tools/prompts/resources across all servers
- Executing tools with proper error handling
- Connection lifecycle management

### scripts/cli.ts

Command-line interface for MCP operations. Commands:

- `list-tools` - Display all tools and save to `assets/tools.json`
- `list-prompts` - Display all prompts
- `list-resources` - Display all resources
- `call-tool <server> <tool> <json>` - Execute a tool

**Note**: `list-tools` persists complete tool catalog to `assets/tools.json` with full schemas for fast reference, offline browsing, and version control.

## Quick Start

**Setup scripts** (one-time):

```bash
cd .claude/skills/mcp-management/scripts && npm install
```

**Setup Gemini CLI** (recommended, one-time):

```bash
npm install -g gemini-cli
[ ! -f .gemini/settings.json ] && mkdir -p .gemini && ln -sf .claude/.mcp.json .gemini/settings.json
```

See [Execution Priority](#execution-priority) for which method to use.

## Technical Details

See [references/mcp-protocol.md](references/mcp-protocol.md) for:

- JSON-RPC protocol details
- Message types and formats
- Error codes and handling
- Transport mechanisms (stdio, HTTP+SSE)
- Best practices

## Execution Workflow

1. **Receive Task**: Main agent delegates MCP task
2. **Check Gemini**: Verify `gemini` CLI availability via `command -v gemini`
3. **Execute**: Use the first available method from the priority order below
4. **Report**: Send concise summary (status, output, artifacts, errors)

### Execution Priority

The canonical method order for executing MCP tools:

1. **Gemini CLI** (Primary): Fast, automatic, intelligent tool selection
   - Check: `command -v gemini`
   - Execute: `gemini -y -m gemini-2.5-flash -p "<task>"`
   - Best for: All tasks when available

2. **Direct CLI Scripts** (Secondary): Manual tool specification
   - Use when: Need specific tool/server control, or Gemini unavailable
   - Execute: `npx tsx scripts/cli.ts call-tool <server> <tool> <args>`

3. **mcp-manager Subagent** (Fallback): Context-efficient delegation
   - Use when: Gemini unavailable or failed
   - Keeps main context clean

See [references/gemini-cli-integration.md](references/gemini-cli-integration.md) for complete Gemini CLI guide.
