# Plugin-Scope Skills

Skills distributed as part of a Claude Code plugin, as opposed to user-scope skills in `.claude/skills/`.

## Directory Structure

Plugin skills live in the plugin's `skills/` directory:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
└── skills/
    └── my-skill/
        ├── SKILL.md
        ├── references/
        ├── examples/
        └── scripts/
```

## Creating Plugin Skills

Plugin skills are created directly in the plugin's `skills/` directory — do NOT use `init_skill.py` (that is for user-scope skills).

```bash
mkdir -p plugins/<plugin-name>/skills/<skill-name>/{references,scripts}
touch plugins/<plugin-name>/skills/<skill-name>/SKILL.md
```

All other rules (frontmatter, writing style, progressive disclosure, file size limits) apply identically to user-scope skills.

## Auto-Discovery

Claude Code automatically discovers plugin skills:

1. Scans `skills/` directory for subdirectories containing `SKILL.md`
2. Loads skill metadata (name + description) always
3. Loads SKILL.md body when skill triggers
4. Loads references/examples when Claude determines they're needed

## No Packaging Needed

Plugin skills are distributed as part of the plugin — no zip packaging step. Users get skills when they install the plugin.

Skip the "Packaging" step from the creation process when building plugin skills.

## Testing Plugin Skills

Test skills by installing the plugin locally:

```bash
# Test with --plugin-dir
cc --plugin-dir /path/to/plugin

# Ask questions that should trigger the skill
# Verify skill loads correctly and provides useful guidance
```

## Key Differences from User-Scope Skills

| Aspect    | User-Scope                       | Plugin-Scope                      |
| --------- | -------------------------------- | --------------------------------- |
| Location  | `.claude/skills/<name>/`         | `plugins/<plugin>/skills/<name>/` |
| Init      | `scripts/init_skill.py`          | Manual `mkdir -p`                 |
| Packaging | `scripts/package_skill.py` → zip | Distributed with plugin           |
| Testing   | Direct usage                     | `cc --plugin-dir`                 |
| Discovery | Claude scans `.claude/skills/`   | Claude scans plugin's `skills/`   |
