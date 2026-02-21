#!/usr/bin/env node
/**
 * Validate skill directories have SKILL.md with required structure.
 * Scans all plugins/<name>/skills/ directories.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(__dirname, "../../plugins");

function validateSkills() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error("ERROR: plugins/ directory not found");
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalSkills = 0;

  for (const plugin of plugins) {
    const skillsDir = path.join(PLUGINS_DIR, plugin, "skills");
    if (!fs.existsSync(skillsDir)) continue;

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const dir of dirs) {
      const skillMd = path.join(skillsDir, dir, "SKILL.md");
      if (!fs.existsSync(skillMd)) {
        console.error(`ERROR: ${plugin}/skills/${dir}/ - Missing SKILL.md`);
        hasErrors = true;
        continue;
      }

      const content = fs.readFileSync(skillMd, "utf-8");
      if (content.trim().length === 0) {
        console.error(`ERROR: ${plugin}/skills/${dir}/SKILL.md - Empty file`);
        hasErrors = true;
        continue;
      }

      totalSkills++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(
    `Validated ${totalSkills} skill directories across ${plugins.length} plugins`,
  );
}

validateSkills();
