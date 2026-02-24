#!/bin/bash

PLUGIN_NAME=$1

if [ -z "$PLUGIN_NAME" ]; then
  echo "Usage: $0 <plugin-name>"
  echo "Example: $0 my-new-plugin"
  exit 1
fi

# Create plugin structure
mkdir -p "plugins/$PLUGIN_NAME/.claude-plugin" \
         "plugins/$PLUGIN_NAME/skills" \
         "plugins/$PLUGIN_NAME/commands" \
         "plugins/$PLUGIN_NAME/agents"

# Create plugin.json
cat > "plugins/$PLUGIN_NAME/.claude-plugin/plugin.json" << EOF
{
  "name": "$PLUGIN_NAME",
  "version": "1.0.0",
  "description": "Description of your plugin",
  "author": {
    "name": "Your Name"
  },
  "repository": "https://github.com/thanhnc1308/claude-engineer-toolkit",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "skills": "./skills/",
  "commands": "./commands/",
  "agents": "./agents/"
}
EOF

# Create README.md
cat > "plugins/$PLUGIN_NAME/README.md" << EOF
# $PLUGIN_NAME

Description of your plugin.

## Installation

\`\`\`bash
/plugin install $PLUGIN_NAME@claude-engineer-toolkit
\`\`\`

## Features

- Feature 1
- Feature 2

## Commands

- \`/command-name\`: Description

## Skills

- **skill-name**: Description
EOF

echo "✓ Plugin template created at plugins/$PLUGIN_NAME"

# Register plugin in marketplace.json
MARKETPLACE_FILE=".claude-plugin/marketplace.json"
if [ -f "$MARKETPLACE_FILE" ]; then
  # Check if plugin already exists in marketplace
  if grep -q "\"name\": \"$PLUGIN_NAME\"" "$MARKETPLACE_FILE"; then
    echo "⚠ Plugin '$PLUGIN_NAME' already exists in marketplace.json"
  else
    # Use jq if available, otherwise use sed
    if command -v jq &> /dev/null; then
      # Use jq for clean JSON manipulation
      TMP_FILE=$(mktemp)
      jq --arg name "$PLUGIN_NAME" \
         --arg source "./plugins/$PLUGIN_NAME" \
         --arg desc "Description of your plugin" \
         '.plugins += [{
           name: $name,
           source: $source,
           description: $desc,
           category: "general",
           tags: ["new-plugin"]
         }]' "$MARKETPLACE_FILE" > "$TMP_FILE" && mv "$TMP_FILE" "$MARKETPLACE_FILE"
      echo "✓ Plugin registered in marketplace.json"
    else
      # Fallback: use Python for reliable JSON manipulation
      python3 -c "
import json
import sys

try:
    with open('$MARKETPLACE_FILE', 'r') as f:
        data = json.load(f)

    new_plugin = {
        'name': '$PLUGIN_NAME',
        'source': './plugins/$PLUGIN_NAME',
        'description': 'Description of your plugin',
        'category': 'general',
        'tags': ['new-plugin']
    }

    data['plugins'].append(new_plugin)

    with open('$MARKETPLACE_FILE', 'w') as f:
        json.dump(data, f, indent=2)

    print('✓ Plugin registered in marketplace.json')
except Exception as e:
    print(f'⚠ Could not auto-register plugin: {e}', file=sys.stderr)
    print('  Please manually add the plugin to .claude-plugin/marketplace.json', file=sys.stderr)
" || echo "⚠ Please manually add the plugin to .claude-plugin/marketplace.json"
    fi
  fi
else
  echo "⚠ marketplace.json not found at $MARKETPLACE_FILE"
fi

echo ""
echo "✓ Next steps:"
echo "  1. Edit plugins/$PLUGIN_NAME/.claude-plugin/plugin.json"
echo "  2. Update plugin description and metadata in .claude-plugin/marketplace.json"
echo "  3. Add your skills, commands, agents, or rules to plugins/$PLUGIN_NAME/"