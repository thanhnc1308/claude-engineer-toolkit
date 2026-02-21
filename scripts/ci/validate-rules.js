#!/usr/bin/env node
/**
 * Validate rule markdown files are non-empty.
 * Scans all plugins/<name>/rules/ directories.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(__dirname, "../../plugins");

function validateRules() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error("ERROR: plugins/ directory not found");
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalRules = 0;

  for (const plugin of plugins) {
    const rulesDir = path.join(PLUGINS_DIR, plugin, "rules");
    if (!fs.existsSync(rulesDir)) continue;

    const files = fs
      .readdirSync(rulesDir, { recursive: true })
      .filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(rulesDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const content = fs.readFileSync(filePath, "utf-8");
        if (content.trim().length === 0) {
          console.error(`ERROR: ${plugin}/rules/${file} - Empty rule file`);
          hasErrors = true;
          continue;
        }
        totalRules++;
      } catch (err) {
        console.error(`ERROR: ${plugin}/rules/${file} - ${err.message}`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(
    `Validated ${totalRules} rule files across ${plugins.length} plugins`,
  );
}

validateRules();
