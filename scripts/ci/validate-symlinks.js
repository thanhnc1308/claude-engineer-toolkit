#!/usr/bin/env node
/**
 * Validate that all symlinks inside plugin directories resolve to existing targets.
 * Scans agents/, commands/, skills/, and rules/ subdirectories of each plugin.
 */

const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '../../plugins');
const SCANNED_DIRS = ['agents', 'commands', 'skills', 'rules'];

function scanSymlinks(dir, pluginName, subdir) {
  const errors = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isSymbolicLink()) {
      const target = fs.readlinkSync(entryPath);
      const resolved = path.resolve(dir, target);

      if (!fs.existsSync(resolved)) {
        errors.push(`ERROR: ${pluginName}/${subdir}/${entry.name} - Broken symlink -> ${target}`);
      }
    } else if (entry.isDirectory()) {
      // Recurse one level into subdirectories (e.g. commands/workflow/)
      const nested = scanSymlinks(entryPath, pluginName, `${subdir}/${entry.name}`);
      errors.push(...nested);
    }
  }

  return errors;
}

function validateSymlinks() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error('ERROR: plugins/ directory not found');
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalChecked = 0;

  for (const plugin of plugins) {
    for (const subdir of SCANNED_DIRS) {
      const dir = path.join(PLUGINS_DIR, plugin, subdir);
      if (!fs.existsSync(dir)) continue;

      const errors = scanSymlinks(dir, plugin, subdir);

      for (const err of errors) {
        console.error(err);
        hasErrors = true;
      }

      totalChecked += fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isSymbolicLink()).length;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(`Validated ${totalChecked} symlinks across ${plugins.length} plugins`);
}

validateSymlinks();
