#!/usr/bin/env node
/**
 * Validate command markdown files are non-empty and readable.
 * Scans all plugins/<name>/commands/ directories.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(__dirname, "../../plugins");

function validateCommands() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error("ERROR: plugins/ directory not found");
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalFiles = 0;

  for (const plugin of plugins) {
    const commandsDir = path.join(PLUGINS_DIR, plugin, "commands");
    if (!fs.existsSync(commandsDir)) continue;

    const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(commandsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      if (content.trim().length === 0) {
        console.error(`ERROR: ${plugin}/commands/${file} - Empty command file`);
        hasErrors = true;
        continue;
      }

      totalFiles++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(
    `Validated ${totalFiles} command files across ${plugins.length} plugins`,
  );
}

validateCommands();
