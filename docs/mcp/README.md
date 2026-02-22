# MCP

## Context bloat issue

- Load all MCP into the subagent’s context to avoid overflowing the main context window

### **“mcp-manager” subagent + “mcp-management” skills**

1/ **“mcp-management” skills** contains script snippets to initialize MCP Client from “.claude/.mcp.json” (move the “.mcp.json” file here so the main agent doesn’t load them into context from the start)

2/ **“mcp-manager” subagent** is equipped with **“mcp-management” skills**

Whenever needing to call a tool -> summon “mcp-manager” subagent -> activate “mcp-management” skills -> load MCP servers -> subagent receives list of tools & analyzes to select the tool to use -> call tool & receive result -> return it back to main agent

3/ As MCP consumes a lot of context window, use a LLM with large context window such as gemini-cli to do the MCP processing

## References

- [Anthropic’s “Code execution with MCP” article](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [MCP_MANAGEMENT](https://github.com/mrgoonie/claudekit-skills/blob/main/MCP_MANAGEMENT.md)
