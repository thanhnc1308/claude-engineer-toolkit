#!/usr/bin/env node
/**
 * Validate plugin.json manifests have required fields and no placeholders.
 * Scans all plugins/<name>/.claude-plugin/plugin.json files.
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '../../plugins');
const REQUIRED_FIELDS = ['name', 'version', 'description', 'license'];
const PLACEHOLDER_PATTERNS = ['Description of your plugin', 'Your Name', 'keyword1', 'keyword2'];

function validatePluginJson() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error('ERROR: plugins/ directory not found');
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let validCount = 0;

  for (const plugin of plugins) {
    const jsonPath = path.join(PLUGINS_DIR, plugin, '.claude-plugin', 'plugin.json');

    if (!fs.existsSync(jsonPath)) {
      console.error(`ERROR: ${plugin}/ - Missing .claude-plugin/plugin.json`);
      hasErrors = true;
      continue;
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
      console.error(`ERROR: ${plugin}/plugin.json - Invalid JSON: ${e.message}`);
      hasErrors = true;
      continue;
    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]) {
        console.error(`ERROR: ${plugin}/plugin.json - Missing required field: ${field}`);
        hasErrors = true;
      }
    }

    // Check for placeholder content
    const jsonStr = JSON.stringify(data);
    for (const placeholder of PLACEHOLDER_PATTERNS) {
      if (jsonStr.includes(placeholder)) {
        console.error(`ERROR: ${plugin}/plugin.json - Contains placeholder text: "${placeholder}"`);
        hasErrors = true;
      }
    }

    // Check that plugin name matches directory name
    if (data.name && data.name !== plugin) {
      console.error(
        `ERROR: ${plugin}/plugin.json - Name "${data.name}" does not match directory "${plugin}"`,
      );
      hasErrors = true;
    }

    // Check that declared path fields resolve to existing files/directories
    const PATH_FIELDS = ['agents', 'skills', 'commands', 'rules', 'hooks'];
    const pluginDir = path.join(PLUGINS_DIR, plugin);
    for (const field of PATH_FIELDS) {
      if (!data[field]) continue;
      const paths = Array.isArray(data[field]) ? data[field] : [data[field]];
      for (const p of paths) {
        const resolved = path.resolve(pluginDir, p);
        if (!fs.existsSync(resolved)) {
          console.error(`ERROR: ${plugin}/plugin.json - "${field}" path does not exist: ${p}`);
          hasErrors = true;
        }
      }
    }

    validCount++;
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${validCount} plugin.json manifests`);
}

validatePluginJson();
