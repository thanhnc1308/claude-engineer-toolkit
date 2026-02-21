#!/usr/bin/env node
/**
 * Validate agent markdown files have required frontmatter.
 * Scans all plugins/<name>/agents/ directories.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(__dirname, "../../plugins");
const REQUIRED_FIELDS = ["model", "tools"];

function extractFrontmatter(content) {
  // Strip BOM if present (UTF-8 BOM: \uFEFF)
  const cleanContent = content.replace(/^\uFEFF/, "");
  // Support both LF and CRLF line endings
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function validateAgents() {
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
    const agentsDir = path.join(PLUGINS_DIR, plugin, "agents");
    if (!fs.existsSync(agentsDir)) continue;

    const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const frontmatter = extractFrontmatter(content);

      if (!frontmatter) {
        console.error(`ERROR: ${plugin}/agents/${file} - Missing frontmatter`);
        hasErrors = true;
        continue;
      }

      for (const field of REQUIRED_FIELDS) {
        if (!frontmatter[field]) {
          console.error(
            `ERROR: ${plugin}/agents/${file} - Missing required field: ${field}`,
          );
          hasErrors = true;
        }
      }

      totalFiles++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(
    `Validated ${totalFiles} agent files across ${plugins.length} plugins`,
  );
}

validateAgents();
