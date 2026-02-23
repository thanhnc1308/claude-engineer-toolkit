#!/usr/bin/env node
/**
 * Validate skill directories have SKILL.md with required structure.
 * Scans all plugins/<name>/skills/ directories.
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '../../plugins');
const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function extractFrontmatter(content) {
  const cleanContent = content.replace(/^\uFEFF/, '');
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }
  return frontmatter;
}

function validateFrontmatter(frontmatter, dir, prefix) {
  const errors = [];

  // name: required, kebab-case, must match folder name
  if (!frontmatter.name) {
    errors.push(`${prefix} - Missing required frontmatter field: name`);
  } else {
    if (!KEBAB_CASE_RE.test(frontmatter.name)) {
      errors.push(`${prefix} - name must be kebab-case (got "${frontmatter.name}")`);
    }
    if (/<|>/.test(frontmatter.name)) {
      errors.push(`${prefix} - name must not contain XML angle brackets (< or >)`);
    }
    const nameLower = frontmatter.name.toLowerCase();
    if (nameLower.includes('claude') || nameLower.includes('anthropic')) {
      errors.push(`${prefix} - name must not contain "claude" or "anthropic"`);
    }
    if (frontmatter.name !== dir) {
      errors.push(`${prefix} - name "${frontmatter.name}" must match folder name "${dir}"`);
    }
  }

  // description: required, <1024 chars, no XML tags, must include "use when" or "use proactively when"
  if (!frontmatter.description) {
    errors.push(`${prefix} - Missing required frontmatter field: description`);
  } else {
    if (frontmatter.description.length > 1024) {
      errors.push(
        `${prefix} - description must be under 1024 characters (got ${frontmatter.description.length})`,
      );
    }
    if (/<|>/.test(frontmatter.description)) {
      errors.push(`${prefix} - description must not contain XML tags (< or >)`);
    }
    const descLower = frontmatter.description.toLowerCase();
    if (!descLower.includes('use when') && !descLower.includes('use proactively when')) {
      errors.push(`${prefix} - description must include "use when" or "use proactively when"`);
    }
  }

  return errors;
}

function validateSkills() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error('ERROR: plugins/ directory not found');
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalSkills = 0;

  for (const plugin of plugins) {
    const skillsDir = path.join(PLUGINS_DIR, plugin, 'skills');
    if (!fs.existsSync(skillsDir)) continue;

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const dir of dirs) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) {
        console.error(
          `ERROR: ${plugin}/skills/${dir}/ - Folder name must be kebab-case (no spaces, no underscores, no capitals)`,
        );
        hasErrors = true;
        continue;
      }

      const skillMd = path.join(skillsDir, dir, 'SKILL.md');
      if (!fs.existsSync(skillMd)) {
        console.error(`ERROR: ${plugin}/skills/${dir}/ - Missing SKILL.md`);
        hasErrors = true;
        continue;
      }

      const content = fs.readFileSync(skillMd, 'utf-8');
      if (content.trim().length === 0) {
        console.error(`ERROR: ${plugin}/skills/${dir}/SKILL.md - Empty file`);
        hasErrors = true;
        continue;
      }

      const prefix = `${plugin}/skills/${dir}/SKILL.md`;
      const frontmatter = extractFrontmatter(content);
      if (!frontmatter) {
        console.error(`ERROR: ${prefix} - Missing YAML frontmatter`);
        hasErrors = true;
        continue;
      }

      const fmErrors = validateFrontmatter(frontmatter, dir, prefix);
      for (const err of fmErrors) {
        console.error(`ERROR: ${err}`);
        hasErrors = true;
      }

      totalSkills++;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${totalSkills} skill directories across ${plugins.length} plugins`);
}

validateSkills();
