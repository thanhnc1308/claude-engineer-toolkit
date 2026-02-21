#!/usr/bin/env node
/**
 * Validate hooks.json schema.
 * Scans all plugins/<name>/hooks/hooks.json files.
 */

const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = path.join(__dirname, "../../plugins");
const VALID_EVENTS = [
  "PreToolUse",
  "PostToolUse",
  "PreCompact",
  "SessionStart",
  "SessionEnd",
  "Stop",
  "Notification",
  "SubagentStop",
];

function validateHooksFile(plugin, hooksFile) {
  let hasErrors = false;
  let totalMatchers = 0;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(hooksFile, "utf-8"));
  } catch (e) {
    console.error(
      `ERROR: ${plugin}/hooks/hooks.json - Invalid JSON: ${e.message}`,
    );
    return { hasErrors: true, totalMatchers: 0 };
  }

  // Support both object format { hooks: {...} } and direct format
  const hooks = data.hooks || data;

  if (typeof hooks === "object" && !Array.isArray(hooks)) {
    // Object format: { EventType: [matchers] }
    for (const [eventType, matchers] of Object.entries(hooks)) {
      if (!VALID_EVENTS.includes(eventType)) {
        console.error(
          `ERROR: ${plugin}/hooks/hooks.json - Invalid event type: ${eventType}`,
        );
        hasErrors = true;
        continue;
      }

      if (!Array.isArray(matchers)) {
        console.error(
          `ERROR: ${plugin}/hooks/hooks.json - ${eventType} must be an array`,
        );
        hasErrors = true;
        continue;
      }

      for (let i = 0; i < matchers.length; i++) {
        const matcher = matchers[i];
        if (typeof matcher !== "object" || matcher === null) {
          console.error(
            `ERROR: ${plugin}/hooks/hooks.json - ${eventType}[${i}] is not an object`,
          );
          hasErrors = true;
          continue;
        }
        if (!matcher.matcher) {
          console.error(
            `ERROR: ${plugin}/hooks/hooks.json - ${eventType}[${i}] missing 'matcher' field`,
          );
          hasErrors = true;
        }
        if (!matcher.hooks || !Array.isArray(matcher.hooks)) {
          console.error(
            `ERROR: ${plugin}/hooks/hooks.json - ${eventType}[${i}] missing 'hooks' array`,
          );
          hasErrors = true;
        } else {
          for (let j = 0; j < matcher.hooks.length; j++) {
            const hook = matcher.hooks[j];
            if (!hook.type || typeof hook.type !== "string") {
              console.error(
                `ERROR: ${plugin}/hooks/hooks.json - ${eventType}[${i}].hooks[${j}] missing or invalid 'type' field`,
              );
              hasErrors = true;
            }
            if (
              !hook.command ||
              (typeof hook.command !== "string" && !Array.isArray(hook.command))
            ) {
              console.error(
                `ERROR: ${plugin}/hooks/hooks.json - ${eventType}[${i}].hooks[${j}] missing or invalid 'command' field`,
              );
              hasErrors = true;
            }
          }
        }
        totalMatchers++;
      }
    }
  } else if (Array.isArray(hooks)) {
    // Array format (legacy)
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      if (!hook.matcher) {
        console.error(
          `ERROR: ${plugin}/hooks/hooks.json - Hook ${i} missing 'matcher' field`,
        );
        hasErrors = true;
      }
      if (!hook.hooks || !Array.isArray(hook.hooks)) {
        console.error(
          `ERROR: ${plugin}/hooks/hooks.json - Hook ${i} missing 'hooks' array`,
        );
        hasErrors = true;
      } else {
        for (let j = 0; j < hook.hooks.length; j++) {
          const h = hook.hooks[j];
          if (!h.type || typeof h.type !== "string") {
            console.error(
              `ERROR: ${plugin}/hooks/hooks.json - Hook ${i}.hooks[${j}] missing or invalid 'type' field`,
            );
            hasErrors = true;
          }
          if (
            !h.command ||
            (typeof h.command !== "string" && !Array.isArray(h.command))
          ) {
            console.error(
              `ERROR: ${plugin}/hooks/hooks.json - Hook ${i}.hooks[${j}] missing or invalid 'command' field`,
            );
            hasErrors = true;
          }
        }
      }
      totalMatchers++;
    }
  } else {
    console.error(
      `ERROR: ${plugin}/hooks/hooks.json - must be an object or array`,
    );
    hasErrors = true;
  }

  return { hasErrors, totalMatchers };
}

function validateHooks() {
  if (!fs.existsSync(PLUGINS_DIR)) {
    console.error("ERROR: plugins/ directory not found");
    process.exit(1);
  }

  const plugins = fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  let hasErrors = false;
  let totalMatchers = 0;
  let pluginsWithHooks = 0;

  for (const plugin of plugins) {
    const hooksFile = path.join(PLUGINS_DIR, plugin, "hooks", "hooks.json");
    if (!fs.existsSync(hooksFile)) continue;

    pluginsWithHooks++;
    const result = validateHooksFile(plugin, hooksFile);
    if (result.hasErrors) hasErrors = true;
    totalMatchers += result.totalMatchers;
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log(
    `Validated ${totalMatchers} hook matchers across ${pluginsWithHooks} plugins`,
  );
}

validateHooks();
